# 快速创建专题项目

> 生产中常需要开发活动页面，这些页面有很多内容可以复用，逐一复制修改比较费时，可以使用本工具快速生成活动相关文件。该工具不具有普适性，所以未发布 npm 包，下载后自定义所需模板，然后 `npm link` 链接到全局，方便本地使用。

## 版本说明

- v1：支持拷贝模板文件，支持多级目录（已实现）
- v2：支持删除已生成文件及目录（未实现）

## 全局安装

```bash
$ git clone git@github.com:MoonWang/quick-tmpl.git
$ cd quick-tmpl
$ npm init
$ npm link
```

## 使用说明

```bash
$ cd projectRoot
$ tmpl -s specialName -t specialTitle
```

## 定制说明

### 修改调用命令

```json
// package.json
{
    "bin": {
        "YourShellCommand": "bin/cli.js"
    },
}
```

### 修改模板传参

模板中添加占位符：

```javascript
// template/xxx
<%-argument%>
```

启动脚本中添加传参：

```javascript
// bin/cli.js
let options = {
    ...,
    argument: data
};
```

shell 脚本传参    

```javascript
// 配置命令行提示
yargs.options('t', {// 参数，即 -t 传参
    alias: 'title', // 别名，即 --title 传参
    demand: false,  // 是否必需
    type: 'string', // 类型
    description: '请设置专题标题' // 说明
})

// 获取命令行传参
let { title } = argv;
```

## 测试

```bash
$ npm run test
```

可在项目根目录下 test 目录下生成对应目录及文件，即为成功。