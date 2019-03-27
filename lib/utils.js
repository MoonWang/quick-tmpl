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

module.exports = {
    mkdir: mkdirPromise
}
