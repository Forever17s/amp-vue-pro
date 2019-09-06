<!--
复制到剪切板组件
参数：
content 要复制的内容。String
iconClass 标签图标。默认‘py-icon-document’。String
tipWords 组件hover的文字介绍。默认‘复制’。String
successWords 复制完成的文字提示。默认‘已复制到剪切板’。String
-->
<template>
  <div class="copy-container">
    <py-tooltip
            content="Top center"
            placement="top"
            effect="light"
            :content="tipWords"
    >
      <i :class="iconClass" class="copy-icon" @click="copy"></i>
    </py-tooltip>
    <py-tag type="success" class="success-tip" :class="{ 'success-motion': showSuccess }">{{ successWords }}</py-tag>
  </div>
</template>

<script>
  import PyTooltip from '../../tooltip';
  import PyCol from '../../col';
  import PyTag from '../../tag';
  export default {
    name: 'PyCopy',

    components: {
      PyCol,
      PyTooltip,
      PyTag
    },

    componentName: 'PyCopy',

    props: {
      content: String,
      iconClass: {
        type: String,
        default: 'py-icon-document'
      },
      tipWords: {
        type: String,
        default: '复制'
      },
      successWords: {
        type: String,
        default: '已复制到剪切板',
      }
    },
    data() {
      return {
        motion: null,
        showSuccess: false,
      };
    },
    computed: {

    },
    methods: {
      copy() {
        const u = navigator.userAgent;
        const oInput = document.createElement('input');
        oInput.value = this.content;
        document.body.appendChild(oInput);
        // IOS
        if (u.match(/(iPhone|iPod|iPad);?/i)) {
          const range = document.createRange();
          // 选中需要复制的节点
          range.selectNode(oInput);
          // 执行选中元素
          window.getSelection().addRange(range);
          // 执行 copy 操作
          document.execCommand('copy');
          // 移除选中的元素
          window.getSelection().removeAllRanges();
        }
        // windows
        else {
          // 选择对象
          oInput.select();
          // 执行浏览器复制命令
          document.execCommand("Copy");
        }
        if (this.showSuccess) {
          clearTimeout(this.motion);
          this.showSuccess = false;
          this.motion = setTimeout(() => {
            this.showSuccess = true;
          },100);
        } else {
          this.showSuccess = true;
          this.motion = setTimeout(() => {
            this.showSuccess = false;
          },2000);
        }
      },
    },
  };
</script>

<style type="scss" scoped>
  .copy-container {
    position: absolute;
    display: inline-block;
    .copy-icon {
      cursor: pointer;
      display: inline-block;
    }
    .success-tip {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      opacity: 0;
    }
    .success-motion {
      -webkit-animation: successMotion 2s 1 ease-in-out;
      -o-animation: successMotion 2s 1 ease-in-out;
      animation: successMotion 2s 1 ease-in-out;
      @-webkit-keyframes successMotion {
        from{opacity: 1;left: 0rem; }
        to{opacity: 0;left: 2rem; }
      }
      @-o-keyframes successMotion {
        from{opacity: 1;left: 0rem; }
        to{opacity: 0;left: 2rem; }
      }
      @keyframes successMotion {
        from{opacity: 1;left: 0rem; }
        to{opacity: 0;left: 2rem; }
      }
    }
    .copy-icon,.success-tip {
      vertical-align: middle;
      text-align: left;
      /*white-space: normal;*/
    }
  }
  .copy-container:after {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
</style>
