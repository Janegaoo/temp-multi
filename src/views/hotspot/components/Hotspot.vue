<!--
 * @Author: Jane
 * @Date: 2020-05-27 15:00:22
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-27 15:01:08
 * @Descripttion:
-->
<template>
  <div>
    <van-button type="info">信息按钮</van-button>
    <krpano :xml="xml" target="viewPano" html5="auto"
      :mobilescale="mobilescale"
      :consolelog="consolelog"
      :passQueryParameters="passQueryParameters"
      @panoCreated="krpanoOnreadyCallback"
    ></krpano>
  </div>
</template>

<script>
// @ is an alias to /src
import http from '@/api/test';

export default {
  name: 'Home',
  components: {
  },
  data() {
    // const vm = this;
    return {
      xml: '../xml/local.xml',
      mobilescale: 1,
      passQueryParameters: true,
      consolelog: true,
      krpano: null,
      picInfo: {
        photoList: [
          {
            sortIndex: 1,
            picTitle: '大厅',
            localUrl: '../img/pano/checkroom.jpg',
            colId: 0,
            hotspotList: [
              {
                sceneHotspot: 1,
                hotName: 'hs0000001',
                iconUrl: '../img/hotspots/hotspot1.svg',
                linkColId: 0, // 0 - 表示本图集内跳转，发布时后端需要修改为实际的图集Id
                linkIndex: 2, // 图集内图片的序号
                title: '空间2',
                ath1: 0,
                atv1: 0,
              },
              {
                sceneHotspot: 2,
                hotName: 'hs0000003',
                iconUrl: '../img/hotspots/hotspot2.svg',
                linkColId: 3356, // 0 - 表示本图集内跳转，发布时后端需要修改为实际的图集Id
                linkIndex: 2, // 图集内图片的序号
                title: '空间空间2',
                ath1: -13.5188143561,
                atv1: -14.6977438465,
              },
              {
                sceneHotspot: 3,
                hotName: 'hs0000004',
                iconUrl: '../img/hotspots/hotspot3.svg',
                linkColId: 3356, // 0 - 表示本图集内跳转，发布时后端需要修改为实际的图集Id
                linkIndex: 2, // 图集内图片的序号
                title: '空间空间空间2',
                ath1: 13.5188143561,
                atv1: 14.6977438465,
              },
            ],
          },
          {
            sortIndex: 2,
            picTitle: '艺术馆',
            localUrl: '../img/pano/picture.jpg',
            colId: 0,
            hotspotList: [
              {
                sceneHotspot: 2,
                hotName: 'hs0000002',
                iconUrl: '../img/hotspots/hotspot2.svg',
                linkColId: 0, // 0 - 表示本图集内跳转，发布时后端需要修改为实际的图集Id
                linkIndex: 2, // 图集内图片的序号
                title: '空间2',
                ath1: 0,
                atv1: 0,
              },
            ],
          },
          {
            sortIndex: 4,
            picTitle: '影院',
            localUrl: '../img/pano/film.jpg',
            colId: 0,
          },
          {
            sortIndex: 5,
            picTitle: '艺术馆',
            localUrl: '../img/pano/picture.jpg',
            colId: 0,
            hotspotList: [
              {
                sceneHotspot: 2,
                hotName: 'hs0000002',
                iconUrl: '../img/hotspots/hotspot2.svg',
                linkColId: 0, // 0 - 表示本图集内跳转，发布时后端需要修改为实际的图集Id
                linkIndex: 2, // 图集内图片的序号
                title: '空间2',
                ath1: 0,
                atv1: 0,
              },
            ],
          },
          {
            sortIndex: 3,
            picTitle: '影院',
            localUrl: '../img/pano/film.jpg',
            colId: 0,
          },
        ],
      },
    };
  },
  mounted() {
    http.getCardProductList({ a: 1 }).then((r) => {
      console.log(r);
    });
    console.log('123456');
  },
  methods: {
    krpanoOnreadyCallback(krpanoInterface) {
      console.log('1111111');
      console.log(krpanoInterface);
      this.krpano = krpanoInterface;
      for (let i = 0; i < this.picInfo.photoList.length; i += 1) {
        const sceneName = `scene_${this.picInfo.photoList[i].colId}_${this.picInfo.photoList[i].sortIndex}`;
        const hlookat = this.picInfo.photoList[i].pictureSettings ? this.picInfo.photoList[i].pictureSettings.hlookat : 0;
        const vlookat = this.picInfo.photoList[i].pictureSettings ? this.picInfo.photoList[i].pictureSettings.vlookat : 0;
        const fov = this.picInfo.photoList[i].pictureSettings ? this.picInfo.photoList[i].pictureSettings.fov : 95;
        if (this.picInfo.photoList[i].localUrl) {
          // 本地图片
          this.krpano.call(`addscene(${sceneName})`);
          this.krpano.set(`scene[${sceneName}].content`,
            `<view hlookat="${hlookat}" vlookat="${vlookat}" fovtype="MFOV" fov="${fov}" fovmin="70" fovmax="120" limitview="auto" /><image><sphere url="${this.picInfo.photoList[i].localUrl}" /></image>`);
        }
      }
      this.krpano.set('layer[hotspot_pos_info].visible', false);
      this.krpano.set('layer[closetext].visible', false);
      console.log(this.krpano.get('layer[closetext]'));
      setTimeout(() => {
        this.krpano.set('layer[hotspot_pos_info].visible', false);
        this.krpano.set('layer[closetext].alpha', 0.0);
        this.krpano.set('layer[closetext].visible', false);
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
  html {
    height: 100%;
  }
  .vue-krpano {
    width: 100%;
    height: 100vh;
  }
</style>
