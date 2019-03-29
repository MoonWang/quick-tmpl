const path = require('path');
const fs = require('fs');

// 查看是否存在目录
async function access(parent) {
    return new Promise((resolve, reject) => {
        fs.access(parent, err => {
            err ? reject(err) : resolve();
        });
    });
}

// 创建单目录
async function mkdir(parent) {
    return new Promise((resolve, reject) => {
        fs.mkdir(parent, err => {
            err ? reject(err) : resolve();
        });
    });
}

// 创建目录
async function mkdirPromise(dir, callback) {
    let parts = dir.split(path.sep);
    for (let i = 1; i <= parts.length; i++) {
        let parent = parts.slice(0, i).join(path.sep);
        try {
            await access(parent);
        } catch (err) {
            await mkdir(parent);
        }
    }
}

// 删除目录
function rmdirPromise(dir) {
    return new Promise((resolve,reject) => {
        fs.stat(dir,(err,stat) => {
            if (err) return reject(err);
            if (stat.isDirectory()) { 
                fs.readdir(dir, (err, files) => {
                    let paths = files.map(file => path.join(dir, file));
                    let promises = paths.map(p => rmdirPromise(p));
                    Promise.all(promises).then(() => fs.rmdir(dir, resolve));
                });
            } else {
                fs.unlink(dir, resolve);
            }
        });
    });
}


module.exports = {
    mkdir: mkdirPromise,
    rmdir: rmdirPromise
}
