<!--
 * @Author: Jane
 * @Date: 2020-05-27 17:15:22
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-29 13:16:11
 * @Descripttion:
-->
<template>
  <div class="previewContainer">
    <div class="previewHead">
      <div style="position: relative;">
        <div class="headLeft">
          <svg-icon iconName="back" class="backBtn" />
        </div>
        <div class="headCenter">{{userInfo.colTitle}}</div>
      </div>
    </div>
    <div class="panoContent" style="position: relative;">
      <krpano
        :xml="xml"
        target="pano"
        html5="auto"
        :mobilescale="mobilescale"
        :consolelog="consolelog"
        :passQueryParameters="passQueryParameters"
        @panoCreated="krpanoOnreadyCallback"
      ></krpano>
      <div class="viewScene"></div>
      <div class="user" v-if="showUser">
        <div class="userInfoImg">
          <img class="userImg" :src="userInfo.headImage" alt />
        </div>
        <div class="userInfo">
          <div class="userName">{{userInfo.userName}}</div>
          <div class="userView">
            人气:
            <span>{{userInfo.viewCount}}</span>
          </div>
        </div>
        <img class="userTelImg" src="images/phone.svg" alt v-if="showTel" />
      </div>
      <div class="logo">
        <img src="images/logo.svg" alt />
      </div>
    </div>
    <div class="changeOtherSceneBtn"></div>
    <div class="viewOtherIntroBtn"></div>
    <div class="detailTranslate">
      <div class="viewMap" v-if="showViewMap">
        <img class="viewLocal" src="images/viewLocal.svg" alt />
        <span>{{userInfo.positionName}}</span>
      </div>
      <div class="sceneOtherIntroDetail">
        <div class="sceneIntro"></div>
      </div>
      <div class="sceneOtherDetail">
        <div class="sceneChange">
          <div class="changeParent">
            <div class="localScene" v-for="(v, i) of picList" :key="i">
              <div
                class="sceneImg"
                :scene="`scene_${v[i][colId]}_${v[i].sortIndex}`"
                :title="`${Tools.escapeHtml(picList[i].picTitle)}`"
                :sortIndex="`${picList[i].sortIndex}`"
                :id="`${picList[i].id}`">
                <img :src="`${sceneImg}`" />
              </div>
              <div class="sceneTitle">{{Tools.escapeHtml(picList[i].picTitle)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modelContent" v-if="showMdelContent" @click="modelContentFn(true)">
      <div class="telModel">
        <div class="userModelImg">
          <img class="userImg" src alt />
        </div>
        <div class="userModelName">
          <span class="userName"></span>
        </div>
        <div class="userModelTel">
          <img src="images/telLogo.svg" alt />
          <span class="userTel">{{userInfo.telContact}}</span>
        </div>
        <div class="userModelBtn">
          <div class="modelCancel" @click="modelContentFn(false)">取消</div>
          <div class="modelConfirm" @click="modelContentFn(true)">
            <a :href="`tel:${userInfo.telContact}`">联系我</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HTTP from '@/api/test';
import Config from '@build/config';
import DsBridge from '@/utils/dsbridge';
import AesUtil from '@/utils/aesUtil';
import Tools from '@/utils/tools';

export default {
  name: 'Home',
  components: {},
  data() {
    // const vm = this;
    return {
      xml: '../xml/local.xml',
      mobilescale: 1,
      passQueryParameters: true,
      consolelog: true,
      krpano: null,
      loadBlend: 1,
      userInfo: {},
      showTel: false,
      showMdelContent: false,
      showUser: false,
      showViewMap: false,
      baseUrl: 'col/',
      blendType: [
        'BLEND(0.3, easeInCubic)', // 淡入淡出
        'ZOOMBLEND(0.8, 2.0, easeInOutSine)', // 缩放过渡
        'COLORBLEND(2.0, 0x000000, easeOutSine)', // 黑场过渡
        'LIGHTBLEND(1.0, 0xFFFFFF, 2.0, linear)', // 白场过渡
        'SLIDEBLEND(1.0, 0.0, 0.2, linear)', // 从右至左
        'SLIDEBLEND(1.0, 90.0, 0.01, linear)', // 从上至下
        'SLIDEBLEND(1.0, 135.0, 0.4, linear)', // 对角线
        'OPENBLEND(1.0, 0.0, 0.2, 0.0, linear)', // 圆形展开
        'OPENBLEND(0.7, 1.0, 0.1, 0.0, linear)', // 垂直展开
        'OPENBLEND(1.0, -1.0, 0.3, 0.0, linear)', // 水平展开
        'OPENBLEND(1.0, -0.5, 0.3, 0.8, linear)', // 椭圆缩放
      ],
      localStr: {
        headImage: 'panocol/43/headImage.png',
        userName: '曙',
        colTitle: '我的老洋房',
        colDescription: '豪华大别墅',
        positionInfo: '江苏南京江宁区',
        positionName: '千人大厦',
        telContact: '13913913913',
        viewCount: 28,
      },
      picList: [],
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
    // filter: drop-shadow(2px 2px 2px red);
    HTTP.getCardProductList({ a: 1 }).then((r) => {
      console.log(r);
    });
    this.readyFun();
  },
  methods: {
    readyFun() {
      // fade1 = setTimeout(() => {
      //   $('.switch').attr('id', 'fadeOut');
      //   clearInterval(changeImg);
      //   clearTimeout(fade1);
      // }, 1100);
      // fade2 = setTimeout(() => {
      //   $('.switch').hide();
      //   clearTimeout(fade2);
      // }, 1600);
      console.log(AesUtil);
      if (Config.ENV === 'dev') {
        this.userInfo = this.localStr;
      } else {
        const str = DsBridge.call('panospace.previewInfoSyn');
        const aesUtil = new AesUtil();
        const plaintext = aesUtil.decrypt(str);
        this.userInfo = plaintext ? JSON.parse(plaintext) : plaintext;
      }

      // $('.sceneIntro').text(this.userInfo.colDescription || '暂无作品简介');

      if (this.userInfo.telContact) {
        this.showTel = true;
        this.showUser = true;
        // var width = Math.max($('.userInfo').width(), $('.userView').width());
        // $('.user').css('width', `${50 + width}px`);
      } else {
        this.showUser = true;
        // var width = Math.max($('.userInfo').width(), $('.userView').width());
        // $('.user').css('width', `${34 + width}px`);
      }
      if (this.userInfo.positionName) {
        this.showViewMap = true;
      } else {
        this.showViewMap = false;
      }
      const data = JSON.parse(localStorage.getItem('picList'));
      this.picList = data.photoList;
      this.renderPicList(data.photoList);
      const picXml = `${this.baseUrl + data.photoList[0].userId}/${
        data.photoList[0].picPath
      }`;
      this.renderKrpano(picXml);
    },
    renderPicList(list) {
      // this.hideTitle(list[0].picTitle, 1);
      
      $('.changeParent').empty();
      for (let i = 0; i < this.picList.length; i += 1) {
        let sceneDiv = null;
        const base = '../panocol/';
        // 服务器图片
        const imageUrl = `${base + this.picList[i].userId}/${
          this.picList[i].colId
        }/${this.picList[i].picPath}/`;
        const sceneImg = this.picList[i].localUrl
          ? `${this.picList[i].localUrl.slice(
            0,
            this.picList[i].localUrl.lastIndexOf('.'),
          )}_thumb.${this.picList[i].localUrl.substring(
            this.picList[i].localUrl.lastIndexOf('.') + 1,
          )}`
          : `${imageUrl}thumb.jpg`;
        if (i === 0) {
          sceneDiv = `<div class="localScene active"><div class="sceneImg" scene="scene_${
            picList[i].colId
          }_${picList[i].sortIndex}" title="${escapeHtml(
            picList[i].picTitle,
          )}" sortIndex="${picList[i].sortIndex}" id="${
            picList[i].id
          }"><img src="${sceneImg}"></div><div class="sceneTitle">${escapeHtml(
            picList[i].picTitle,
          )}</div></div>`;
        } else {
          sceneDiv = `<div class="localScene"><div class="sceneImg" scene="scene_${
            picList[i].colId
          }_${picList[i].sortIndex}" title="${escapeHtml(
            picList[i].picTitle,
          )}" sortIndex="${picList[i].sortIndex}" id="${
            picList[i].id
          }"><img src="${sceneImg}"></div><div class="sceneTitle">${escapeHtml(
            picList[i].picTitle,
          )}</div></div>`;
        }
        $('.changeParent').append(sceneDiv);
      }
      $('.localScene').each(function () {
        $(this)
          .unbind('click')
          .click(function () {
            if (!$(this).hasClass('active')) {
              // 更改选中状态样式
              $('.localScene').removeClass('active');
              $(this).addClass('active');
              // 显示当前场景名称
              const title = $(this)
                .find('.sceneImg')
                .attr('title');
              hideTitle(title, 2);
              // 切换场景
              const scene = $(this)
                .find('.sceneImg')
                .attr('scene');
              const pic = $(this)
                .find('.sceneImg')
                .attr('sortIndex');
              loadSceneFn(scene, pic);
            }
          });
      });
      renderPicWidth();
    },
    hideTitle(title, num) {
      clearTimeout(hideTitleFun);
      $('.viewScene').text(title || ' ');
      $('.viewScene').css('opacity', '1');
      if (num == 1) {
        hideTitleFun = setTimeout(() => {
          $('.viewScene').css('opacity', '0');
        }, 8000);
      } else {
        hideTitleFun = setTimeout(() => {
          $('.viewScene').css('opacity', '0');
        }, 3000);
      }
    },
    modelContentFn(t) {
      this.showMdelContent = t;
    },
    krpanoOnreadyCallback(krpanoInterface) {
      this.krpano = krpanoInterface;
      for (let i = 0; i < this.picInfo.photoList.length; i += 1) {
        const sceneName = `scene_${this.picInfo.photoList[i].colId}_${this.picInfo.photoList[i].sortIndex}`;
        const hlookat = this.picInfo.photoList[i].pictureSettings
          ? this.picInfo.photoList[i].pictureSettings.hlookat
          : 0;
        const vlookat = this.picInfo.photoList[i].pictureSettings
          ? this.picInfo.photoList[i].pictureSettings.vlookat
          : 0;
        const fov = this.picInfo.photoList[i].pictureSettings
          ? this.picInfo.photoList[i].pictureSettings.fov
          : 95;
        if (this.picInfo.photoList[i].localUrl) {
          // 本地图片
          // this.krpano.call(`addscene(${sceneName})`);
          // this.krpano.set(`scene[${sceneName}].content`,
          //   `<view hlookat="${hlookat}" vlookat="${vlookat}" fovtype="MFOV" fov="${fov}" fovmin="70" fovmax="120" limitview="auto" /><image><sphere url="${this.picInfo.photoList[i].localUrl}" /></image>`);
          // 本地图片
          this.krpano.call(`addscene(${sceneName})`);
          this.krpano.set(
            `scene[${sceneName}].content`,
            `<view hlookat="${hlookat}" vlookat="${vlookat}" fovtype="MFOV" fov="${fov}" fovmin="70" fovmax="120" limitview="auto" /><image><sphere url="${this.picInfo.photoList[i].localUrl}" /></image>`,
          );
        } else {
          const base = '../panocol/';
          // 服务器图片
          const imageUrl = `${base + this.picInfo.photoList[i].userId}/${
            this.picInfo.photoList[i].colId
          }/${this.picInfo.photoList[i].picPath}/`;
          this.krpano.call(`addscene(${sceneName})`);
          this.krpano.set(
            `scene[${sceneName}].content`,
            `<view hlookat="${hlookat}" vlookat="${vlookat}" fovtype="MFOV" fov="${fov}" fovmin="70" fovmax="120" limitview="auto" /><preview url="${imageUrl}preview.jpg" /><image><cube url="${imageUrl}pano_%s.jpg" /></image>`,
          );
        }
      }
      setTimeout(() => {
        if (this.picInfo.photoList[0].hotspotList) {
          const list = this.picInfo.photoList[0].hotspotList;
          for (let j = 0; j < list.length; j += 1) {
            this.renderHotpot(list[j]);
          }
        }
      }, 600);
    },
    renderHotpot(hotspot) {
      if (this.krpano) {
        const h = hotspot.ath1;
        const v = hotspot.atv1;
        const hsName = hotspot.hotName;
        const icon = hotspot.iconUrl;
        const scene = `scene_${hotspot.linkColId}_${hotspot.linkIndex}`;
        const picId = hotspot.linkIndex;

        this.krpano.call(`addhotspot(${hsName})`);
        this.krpano.set(`hotspot[${hsName}].url`, `%SWFPATH%/${icon}`);
        this.krpano.set(`hotspot[${hsName}].ath`, h);
        this.krpano.set(`hotspot[${hsName}].atv`, v);
        this.krpano.set(`hotspot[${hsName}].distorted`, false);
        this.krpano.set(`hotspot[${hsName}].renderer`, 'css3d');
        if (hotspot.title) {
          this.krpano.set(`hotspot[${hsName}].onloaded`, () => {
            const element = document.createElement('div');
            element.innerHTML = hotspot.title;
            element.className = 'hotspotTxt';
            this.krpano.get(`hotspot[${hsName}].sprite`).appendChild(element);
          });
        }
        if (this.krpano.get('device.html5')) {
          console.log(123);
          // for HTML5 it's possible to assign JS functions directly to krpano events
          this.krpano.set(`hotspot[${hsName}].onclick`, () => {
            // `js(this.aaabbbhs(${scene},${picId}))`
            this.loadSceneFn(scene, picId);
          });
        } else {
          // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
          this.krpano.set(
            `hotspot[${hsName}].onclick`,
            "js( alert(calc('hotspot \"' + name + '\" clicked')) );",
          );
        }
      }
    },
    loadSceneFn(scene, pic) {
      if (this.krpano) {
        this.krpano.call(
          `loadscene(${scene}, view.fisheye=0.0&skin_settings.littleplanetintro=false,MERGE,${
            this.blendType[this.loadBlend]
          })`,
        );
        this.krpano.call('loop(hotspot.count GT 0, removehotspot(0) );');
        let list = [];
        for (let i = 0; i < this.picInfo.photoList.length; i += 1) {
          if (this.picInfo.photoList[i].sortIndex === pic * 1) {
            if (this.picInfo.photoList[i].hotspotList) {
              list = this.picInfo.photoList[i].hotspotList;
            } else {
              list = [];
            }
          }
        }
        for (let j = 0; j < list.length; j += 1) {
          this.renderHotpot(list[j]);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.previewContainer {
  height: 100vh;
  position: relative;
  width: 100%;
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.previewHead {
  background: linear-gradient(top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
  background: -ms-linear-gradient(top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.2)
  );
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
  text-align: center;
  overflow: hidden;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  padding: 14px 16px 0 16px;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
  height: 44px;

  .headLeft {
    position: absolute;
    left: 0;
    top: 2px;
  }

  .backBtn {
    width: 20px;
    height: 16px;
    // background: url(../img/back.svg) no-repeat center;
  }

  .headCenter {
    display: inline-block;
    font-size: 16px;
  }
}
.panoContent {
  position: relative;
  height: calc(100vh - 78px);

  .viewScene {
    position: absolute;
    font-size: 14px;
    top: 90px;
    left: 50%;
    -webkit-transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    transition: 0.2s all;
  }

  .user {
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: rgba(28, 28, 30, 0.5);
    border-radius: 20px;
    box-sizing: border-box;
    height: 34px;
    display: none;
  }
  .userInfoImg {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    position: absolute;
    left: 4px;
    top: 4px;
  }
  .userImg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .userInfo {
    display: inline-block;
    font-size: 12px;
    transform: scale(0.75);
    color: #fff;
    margin-left: 34px;
    position: absolute;
    top: 5px;
    transform-origin: 0 0;
    .userName {
      max-width: 60px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .userView {
      transform: scale(0.89);
      position: absolute;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      top: 18px;
      transform-origin: 0 0;
    }
    .userTelImg {
      width: 28px;
      height: 28px;
      position: absolute;
      top: 3px;
      right: 0;
      // display: none;
    }
  }
  .logo {
    position: absolute;
    width: 68px;
    top: 20px;
    left: 16px;
    opacity: 0.2;
    img {
      width: 100%;
    }
  }
  .changeOtherSceneBtn {
    bottom: 9px;
    left: 19px;
  }
  .changeSceneBtn,
  .changeOtherSceneBtn {
    width: 36px;
    height: 36px;
    // background: url(~@/assets/icons/svg/scene.svg) no-repeat;
    // background: url(../img/scene.svg) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 19px;
    left: 44px;
    z-index: 10;
  }
}
</style>
