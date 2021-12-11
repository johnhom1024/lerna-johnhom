# LoadSelect

> 基于element-ui的select组件二次封装的一个异步分页加载选择框

## 示例

以下是load-select的示例

<Demo-Select />

::: details 点击查看代码

```html
<template>
  <load-select
    v-model="selected"
    :data="data"
    :page="page"
    :hasMore="more"
    :request="getData"
  ></load-select>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
      page: 1,
      more: true,
      data: [],
    };
  },
  methods: {
    // 传入给load-select组件的函数
    getData({ page = 1, more = false, keyword = "" } = {}) {
      return new Promise((resolve) => {
        // 访问后端接口API
        this.requestAPI({ page, keyword }).then((res) => {
          if (more) {
            this.data = [...this.data, ...res.result];
          } else {
            this.data = res.result;
          }

          this.page = res.page;
          let { total, page, size } = res;
          this.more = page * size < total;
          this.page = page;
          resolve();
        });
      });
    },
    // 模拟后端接口的API
    requestAPI({ page = 1, size = 10, keyword = "" } = {}) {
      return new Promise((resolve) => {
        if (keyword) {
          setTimeout(() => {
            resolve({
              total: 3,
              page: 1,
              size: 10,
              result: [
                {
                  label: keyword,
                  value: 1,
                },
                {
                  label: keyword + 1,
                  value: 2,
                },
                {
                  label: keyword + 2,
                  value: 3,
                },
              ],
            });
          }, 500);
          return;
        }

        let responseData = [];
        let total = 50; // 假设总共的数据有50条
        for (let index = 1; index <= size; index++) {
          // serial：处于第几个元素，就显示多少序号
          let serial = index + (page - 1) * size;
          if (serial <= 50) {
            responseData.push({
              label: serial,
              value: serial,
            });
          }
        }
        setTimeout(() => {
          resolve({
            total,
            page,
            size,
            result: responseData,
          });
        }, 500);
      });
    },
  },
};
</script>
```
:::

## 安装

```shell
yarn add @johnhom/el-load-select

# 或者可以使用npm
# npm install -S @johnhom/el-load-select
```