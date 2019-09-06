import Copy from './src/copy';

/* istanbul ignore next */
Copy.install = function(Vue) {
  Vue.component('py-copy', Copy);
};

export default Copy;
