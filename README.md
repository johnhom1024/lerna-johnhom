# 使用lerna管理多个npm模块

## 动机

原本我已经有[el-load-select](https://github.com/johnhom1024/el-load-select)这个仓库了，后面修复了一个bug并发布版本的时候发现，npm会把package.json中一些无关信息给带上去，就比如`devDependencies`这个字段里我放了一些文档说明用到的包比如说vuepress，还有展示的时候用到的element-ui，这些都是和el-load-select无关的一些包。

强迫症的我决定使用monorepo的方式管理el-load-select，这样可以把一些文档等无关的包放在root目录上的package.json里。管理monorepo的工具就使用开源并且热门的lerna啦。

## 内部管理的npm模块清单

* [el-load-select](https://github.com/johnhom1024/lerna-johnhom/tree/main/packages/%40johnhom/el-load-select)
