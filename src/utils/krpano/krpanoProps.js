/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-22 16:13:22
 * @Descripttion:
 */


export default {
  bgcolor: {
    type: String,
  },
  wmode: {
    type: String, default: 'opaque',
  },
  vars: {
    type: Object,
  },
  initvars: {
    type: Object,
  },
  basepath: {
    type: String,
  },
  mwheel: {
    type: Boolean, default: false,
  },
  focus: {
    type: Boolean, default: true,
  },
  consolelog: {
    type: Boolean, default: false,
  },
  mobilescale: {
    type: Number, default: 0.5,
  },
  fakedevice: {
    type: String,
  },
  passQueryParameters: {
    type: Boolean, default: false,
  },
  webglsettings: {
    type: Object,
  },
};
