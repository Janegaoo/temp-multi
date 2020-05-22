/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-20 11:19:18
 * @Descripttion:
 */

const config = {
  props: {
    lazyLoad: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.lazyLoad) {
      this.createLock = true;
      this.scrollListener();
      window.addEventListener('scroll', this.scrollListener);
    } else {
      this.createPano();
    }
  },
  methods: {
    scrollListener() {
      const rect = this.$el.getBoundingClientRect();

      // if (-rect.top > rect.height || rect.top > window.innerHeight) {
      //   // 屏幕之外
      //   if (this.krpanoObj) {
      //     this.krpanoObj.call('if(autorotate.enabled,autorotate.pause())');
      //     this.log('out of screen: autorotate paused');
      //   }
      // } else {
      //   // 屏幕之内
      //   if (!this.krpanoObj) {
      //     this.createLock = false;
      //     // lazy load
      //     this.createPano();
      //   } else {
      //     this.krpanoObj.call('if(autorotate.enabled,autorotate.resume())');
      //     this.log('in screen: autorotate resumed');
      //   }
      // }

      if (-rect.top > rect.height || rect.top > window.innerHeight) {
        // 屏幕之外
        if (this.krpanoObj) {
          this.krpanoObj.call('if(autorotate.enabled,autorotate.pause())');
          this.log('out of screen: autorotate paused');
        }
      } else if (!this.krpanoObj) {
        // 屏幕之内
        this.createLock = false;
        // lazy load
        this.createPano();
      } else {
        this.krpanoObj.call('if(autorotate.enabled,autorotate.resume())');
        this.log('in screen: autorotate resumed');
      }
    },
  },
};

export default config;
