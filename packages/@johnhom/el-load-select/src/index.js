import LoadSelect from './components/LoadSelect.vue';
import LoadMoreDirective from './directives/loadmore.js';

const Plugin = {
  install(Vue) {
    if (Plugin.installed) return;
    // 检测是否安装了element-ui
    if (!Vue.prototype.$ELEMENT) {
      throw new Error("请先安装element-ui");
    }
    // 注册全局组件
    Vue.component(LoadSelect.name, LoadSelect);
    // 注册指令
    Vue.directive('loadmore', LoadMoreDirective)
    // 设置安装成功
    Plugin.installed = true;
  }
}

export default Plugin