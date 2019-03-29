#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const yargs = require('yargs');

let CopyTmpl = require('../lib/CopyTmpl');

let argv = yargs.options('s', {
        alias: 'special',
        demand: true,
        type: 'string',
        description: '请设置专题名称'
    })
    .options('t', {
        alias: 'title',
        demand: false,
        type: 'string',
        description: '请设置专题标题'
    })
    .options('D', {
        alias: 'delate',
        demand: false,
        type: 'boolean',
        description: '删除专题'
    })
    .usage('tmpl [options]')
    .example('tmpl -s spring -t 2019春日活动', '以当前目录为项目根目录，生成 spring 专题所需的模板')
    .help('h')
    .alias('h','help')
    .epilog('copyright 2019')
    .argv;

let { special, title, delate } = argv;

let root = process.cwd();

// 如果需要防止目录错乱，即需要限制特定目录才能执行，可以在执行前进行判断
// try {
//     fs.statSync(path.resolve(root, 'src'));
// } catch(e) {
//     console.log('非项目根目录，终止执行');
//     return;
// }

let options = { 
    special,
    title,
    author: 'Moon Wang',
    date: new Date().toLocaleString()
};

let html = new CopyTmpl(`test/views/special/2019/${special}`, 'html',  options, root);
let css = new CopyTmpl(`test/scss/special/2019/${special}`, 'css',  options, root);
let js = new CopyTmpl(`test/page/special/2019/${special}`, 'js',  options, root);

if(delate) {
    html.delate().then(() => css.delate()).then(() => js.delate());
} else {
    html.do().then(() => css.do()).then(() => js.do());
}