module.exports = {
  title: "johnhom的工具库",
  themeConfig: {
    nav: [
      {
        text: "主页",
        link: "/",
      },
      {
        text: '组件库',
        link: '/pages/components/'
      }
    ],
    sidebar: {
      '/pages/components/': [
        {
          isGroup: true,
          title: '组件库',
          collapsable: false,
          children: [
            'LoadSelect',
          ]
        }
      ]
    }
  },
  // fix core-js in https://github.com/zpfz/vuepress-theme-antdocs/issues/5#issuecomment-753821394
  chainWebpack: config => {
    config.resolve.alias.set('core-js/library/fn', 'core-js/features');
  }
};
