# `@johnhom/el-load-select`

## 安装

```
npm install @johnhom/el-load-select

# 或者 yarn add @johnhom/el-load-select
```

## 使用教程

在Vue项目中的`main.js`文件中，加入如下代码：

```javascript
import Vue from 'vue'

import loadSelect from '@johnhom/el-load-select'

Vue.use(loadSelect)
```

在`.vue`文件中，使用该组件：

```html
<template>
  <load-select></load-select>
</template>
```

## 注意事项

该插件是基于`element-ui`中的`Select`组件进行二次封装，所以在你的Vue项目中使用时需要同时导入`element-ui`库，具体的导入步骤可以参考[官方网站](https://element.eleme.cn)