/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-20 11:19:31
 * @Descripttion:
 */

const config = {
  props: {
    freezeVertical: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventDelegate: undefined,
    };
  },
  methods: {},
  watch: {
    freezeVertical(val) {
      if (this.eventDelegate) {
        if (val) {
          this.eventDelegate.style.display = 'block';
          const hlookat = this.krpanoObj.get('view.hlookat');
          this.krpanoObj.call(`lookat(${hlookat},0)`);
        } else {
          this.eventDelegate.style.display = 'none';
        }
      }
    },
  },
  created() {
    if (TouchEvent) {
      this.$on('panoCreated', (krpano) => {
        const origin = krpano.firstChild;

        const eventDelegate = document.createElement('DIV');
        eventDelegate.className = 'event-delegate';
        Object.assign(eventDelegate.style, {
          display: this.freezeVertical ? 'block' : 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          'user-select': 'none',
          'z-index': 1,
        });
        krpano.appendChild(eventDelegate);
        this.eventDelegate = eventDelegate;

        let originTouch;

        eventDelegate.addEventListener('touchstart', (e) => {
          originTouch = e;
          Object.defineProperty(e, 'cancelable', { value: true });
          const event = new TouchEvent('touchstart', e);
          return origin.dispatchEvent(event);
        });

        eventDelegate.addEventListener('touchend', (e) => {
          Object.defineProperty(e, 'cancelable', { value: true });
          const event = new TouchEvent('touchend', e);
          return origin.dispatchEvent(event);
        });

        eventDelegate.addEventListener('touchmove', (e) => {
          const currentTouch = e.changedTouches[0];
          const deltaX = originTouch.clientX - currentTouch.clientX;
          const hlookat = krpano.get('view.hlookat') + deltaX;
          const vlookat = krpano.get('view.vlookat');
          krpano.call(`lookat(${hlookat},${vlookat})`);

          originTouch = currentTouch;

          return true;
        });

        eventDelegate.addEventListener('mousedown', (e) => {
          Object.defineProperty(e, 'cancelable', { value: true });
          return origin.dispatchEvent(new MouseEvent('mousedown', e));
        });

        eventDelegate.addEventListener('mousewheel', (e) => {
          Object.defineProperty(e, 'cancelable', { value: true });
          return origin.dispatchEvent(new MouseEvent('mousewheel', e));
        });
      });
    }
  },
};

export default config;
