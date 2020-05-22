
/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-20 15:04:23
 * @Descripttion:
 */


import krpanoProps from './krpanoProps';

const config = {
  props: {
    xml: {
      type: String, required: true,
    },
    scene: {
      type: String,
    },
    hooks: {
      type: Object,
    },
    debug: {
      type: Boolean, default: false,
    },
    ...krpanoProps,
  },
  data() {
    return {
      createLock: false,
      krpanoObjId: `krpano_${Math.floor(Math.random() * (100000 - 100 + 1) + 100)}`,
    };
  },
  methods: {
    createPano() {
      const { embedpano, removepano } = window;
      if (!(embedpano && removepano)) {
        throw new Error('krpano player is required');
      }

      if (!this.createLock && !this.krpanoObj) {
        this.createLock = true;
        const vm = this;
        this.$el.id = `${this.krpanoObjId}_container`;

        embedpano({
          id: this.krpanoObjId,
          target: this.$el.id,
          xml: this.xml,
          bgcolor: this.bgcolor,
          wmode: this.wmode,
          vars: this.vars,
          initvars: this.initvars,
          basepath: this.basepath,
          mwheel: this.mwheel,
          focus: this.focus,
          consolelog: this.consolelog,
          mobilescale: this.mobilescale,
          fakedevice: this.fakedevice,
          passQueryParameters: this.passQueryParameters,
          webglsettings: this.webglsettings,
          onready(krpanoObj) {
            vm.krpanoObj = krpanoObj;
            vm.krpanoObj.hooks = vm.hooks;
            vm.log('pano created');
            vm.$emit('panoCreated', vm.krpanoObj);
            vm.createLock = false;
          },
          onerror(msg) {
            vm.$emit('panoError', msg);
            vm.createLock = false;
          },
        });
      }
    },
    removePano() {
      const { removepano } = window;

      if (this.krpanoObj) {
        removepano(this.krpanoObj.id);
        this.log('pano removed');
        delete this.krpanoObj;
      }
    },
    loadScene() {
      const { scene } = this;
      if (this.krpanoObj) {
        if (scene) {
          const str = `if(scene[${scene}]===null,
                        loadscene(get(scene[0].name),null,MERGE,BLEND(0.5)),
                        loadscene(${scene},null,MERGE,BLEND(0.5)))`;
          this.krpanoObj.call(str);
          this.log(`scene changed: ${scene}`);
          this.$emit('sceneChanged', scene);
        } else {
          this.krpanoObj.call('loadscene(get(scene[0].name),null,MERGE,BLEND(0.5))');
        }
      }
    },
    log(content) {
      let selfContent = content;
      if (this.debug) {
        if (this.krpanoObj) {
          selfContent = `[${this.krpanoObj.id}] ${content}`;
        }
        console.debug(selfContent);
      }
    },
  },
  watch: {
    xml(newXml) {
      if (this.krpanoObj && newXml) {
        this.krpanoObj.call(`loadpano(${newXml},null,IGNOREKEEP)`);
        this.$emit('xmlChanged', newXml);
        this.log(`xml changed: ${newXml}`);
      }
    },
    scene() {
      this.loadScene();
    },
  },
  created() {
    this.$on(['panoCreated', 'xmlChanged'], this.loadScene);
  },
  beforeDestroy() {
    this.removePano();
  },
};

export default config;
