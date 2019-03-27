const path = require('path');
const fs = require('fs');
const {
    promisify
} = require('util');
const template = require("lodash.template");

const {
    mkdir
} = require('./utils');

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

/**
 * 异步串行创建模板
 * @param {String} root 目标路径(相对执行位置)
 * @param {String} tmpl 模板文件夹名称(template 目录下)
 * @param {Object} options 需要替换的配置
 */
class CopyTmpl {
    constructor(root, tmpl,  options) {
        this.tmpl = tmpl;
        this.options = options;

        // 源根路径(绝对路径，读取用)
        this.fromRoot = path.resolve(__dirname, '..', 'template', tmpl);
        // 目标根路径(相对路径，输出用)
        this.toRoot = root;

        this.files = [];
    }

    do() {
        // 获取所有文件
        return this.getFiles().then(() => {
            // console.log('获取文件信息：');
            // console.log(this.files);
            // 执行文件拷贝
            return this.copyFiles()
        }).then(_ => {
            console.log(`${this.tmpl} 目录模板拷贝完成`);
        }).catch(err => {
            console.log(`${this.tmpl} 目录模板拷贝异常：`);
            console.log(err);
        });
    }

    // 开始查询文件信息
    getFiles(relativePath = './') {
        let _t = this;
        let from = path.resolve(this.fromRoot, relativePath);
        let files = fs.readdirSync(from, {
            withFileTypes: true
        });
        
        function next(i) {
            let file = files[i++];
            // 递归边界条件
            if (!file) return Promise.resolve();
            return Promise.resolve(_t.getFile(relativePath, file, () => next(i)));
        }
        return next(0);
    }

    // 获取文件信息，添加到缓存
    async getFile(relativePath, file, next) {
        if (file.isDirectory()) {
            let dirPath = path.join(relativePath, file.name);
            // 等待递归执行返回
            await this.getFiles(dirPath);
        } else {
            // 缓存路径及文件名
            this.files.push({
                relativePath,
                fileName: file.name
            });
        }
        // 显式调用下一个
        await next();
    }

    // 开始拷贝
    copyFiles() {
        let _t = this;
        
        function next(i) {
            let file = _t.files[i++];
            // 递归边界条件
            if (!file) return Promise.resolve();
            return Promise.resolve(_t.copyFile(file, () => next(i)));
        }
        return next(0);
    }

    // 拷贝单个文件
    async copyFile({relativePath, fileName}, next) {
        let filePath = path.resolve(this.fromRoot, relativePath, fileName);
        try {
            // 1. 读取模板
            let tmpl = await readFile(filePath, {
                encoding: 'utf8'
            });
            // 2. 填充模板
            let fileContent = template(tmpl)(this.options);

            // 3. 创建目录
            let outDirname = path.join(this.toRoot, relativePath);
            await mkdir(outDirname);

            // 4. 输出文件
            let outFilePath = path.join(outDirname, fileName)
            await writeFile(outFilePath, fileContent);

            console.log('输出文件成功：', outFilePath);
            // 显式调用下一个
            await next();
        } catch (e) {
            console.log('拷贝文件失败：', e);
        }
    }

}

module.exports = CopyTmpl;
