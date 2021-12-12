# 使用lerna管理多个npm模块

> lerna + yarn + commitizen + commitlint

## 动机

原本我已经有[el-load-select](https://github.com/johnhom1024/el-load-select)这个仓库了，后面修复了一个bug并发布版本的时候发现，npm会把package.json中一些无关信息给带上去，就比如`devDependencies`这个字段里我放了vuepress文档说明用到的依赖，还有展示的时候用到的element-ui，这些都是和el-load-select发布无关的一些依赖。

强迫症的我决定使用monorepo的方式管理el-load-select，这样可以把vuepress、element-ui这些和发布无关的依赖放在root目录上的package.json里。管理monorepo的工具就使用开源并且热门的lerna啦。

## 内部管理的npm模块清单

* [el-load-select](https://github.com/johnhom1024/lerna-johnhom/tree/main/packages/%40johnhom/el-load-select)

## lerna使用教程

下面我就简单讲解一下在使用lerna的过程当中，用到的一些命令和一些遇到的问题。

### 初始化项目

```
lerna init 
```

### 创建项目

```
lerna create <project-name>
```

lerna 就会在packages文件夹下自动生成一个`<project-name>`文件夹

如果想要生成monorepo结构，首先需要在 package.json 文件中的workspaces字段进行配置

```
// package.json
{
  "workspaces": ["packages/@johnhom/*"],
}
```

最后通过以下命令
```
lerna create @johnhom/<project-name>
```

即可在packages文件夹 下自动新增 @johnhom文件夹，这个文件夹内部就会包含`<project-name>`文件夹。


### 添加模块依赖

给相应的package添加模块依赖

```
# 为所有的package添加chalk模块
lerna add chalk

# 为 @johnhom/el-load-select 增加 rollup 模块 在devDependencies字段
lerna add rollup --dev --scope @johnhom/el-load-select
```

### 根项目安装依赖

# yarn 使用 workspace 模式安装 npm 包时必须加 -W 参数

```
yarn add -D -W [...pkg]
```

## 从外部调试package的包

如果想要对单独的包进行执行命令：

```
lerna run <script> --scope <package-name>
```

通过执行命令：

```
lerna exec -- yarn link
```

将会为每个包都执行一次yarn link，这样外部的项目就阔以通过`yarn link <package name>`引入项目中并且进行调试。

### 发布包

首先需要在命令行中登陆npm账号

```
npm login --registry="https://registry.npmjs.org/"
```

登陆完成之后，如果只想发布包到npm里

```
lerna publish from-package
```

### 更新package.json中的版本号

版本的字段语义：

```
major：主版本号（大版本）
minor：次版本号（小更新）
patch：补丁号（补丁）
premajor：预备主版本
preminor: 预备次版本
prepatch：预备补丁版本
prerelease：预发布版本
```

使用lerna命令如下：

```
lerna version [major | minor | patch | premajor | preminor | prepatch | prerelease]
```

该命令会进行一下的操作：
1. 更改package里面的package.json version字段
2. 根据lerna.json里的conventionalCommits字段判断是否需要生成或者修改changelog.md
3. 打上最新版本的tag
4. 创建一个带有release message的commit
5. push到远程仓库

### lerna.json 用到的一些配置项

#### command.version

```
// lerna.json

{
  "command": {
    "version": {
      // 以下的allowBranch配置之后，在除`master`之外的其他分支运行lerna version命令都将失败。
      "allowBranch": "master"
      // 支持以下的写法
      // "allowBranch": ["master", "feature/*"]
      
      // 保留 commit 的消息，并跳过 git push 此处默认false
      "amend": true, 

      // 当您使用这个参数运行时，lerna version将使用传统的提交规范来确定版本并生成 CHANGELOG.md 文件。
      "conventionalCommits": true,
      
      // 将在更新的包中精确地指定更新过的依赖项(无标点符号)，而不做语义化版本号兼容(使用^)
      // 意思就不用给 version 设置 ^ 前缀
      "exact": true,
      
      // 如果是%s 则输出 v1.0.0；如果是%v 则输出1.0.0
      "message": "chore(release): publish %s"
    },
  },
  // 当检测到更改的包时，忽略由通配符匹配到的文件中的更改
  "ignoreChanges": ["**/__fixtures__/**", "**/__tests__/**", "**/*.md"]
}
```

## 疑难解答

### You must sign up for private packages

npm ERR! publish Failed PUT 402

npm ERR! code E402

npm ERR! You must sign up for private packages : @yuyy/babel

原因：

npm publish 命令执行，默认是进行私有发布，参见官网publish命令
上一篇文章最后提到过scoped的包私有发布时需要收费。

解决：如果不想花钱，那只能将包面向公共发布，这也符合npm鼓励开源的精神，这一点和GitHub创建仓库类似。

```
npm publish --access public
```

如果是lerna项目，需要在待发布的package项目里的package.json加上以下字段：

```
// package.json

"publishConfig": {
  "access": "public"
}
```

### 如果version设置的是independent值，则不会自动给message的 %s %v替换成版本号。

举个例子：

```
// lerna.json
{
  // 这里的version设置成了independent
  "version": "independent",
  "command": {
    "version": {
      "allowBranch": [
        "main"
      ],
      "conventionalCommits": true,
      // 这里的message带有%s或者%v
      "message": "chore(release): publish %s"
    }
  }
```

如果用以上的lerna.json配置文件，在使用lerna version命令进行提交时，%s或者%v会无法被转换成版本号。因为这里是发布某一个独立的package。

官方文档也有说明：[这里](https://github.com/lerna/lerna/blob/main/commands/version/README.md#--message-msg)

所以如果你设置了independent，则直接将message设置成如下即可：

```
"message": "chore(release): publish"
```