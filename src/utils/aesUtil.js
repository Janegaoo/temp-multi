/*
 * @Author: Jane
 * @Date: 2020-05-28 16:20:17
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-28 16:46:04
 * @Descripttion:
 */
import CryptoJS from 'crypto-js/crypto-js';

const AesUtil = () => {
  this.key = CryptoJS.enc.Utf8.parse('9336365521W5F092BB5909E8E033BC69');
  this.iv = CryptoJS.enc.Hex.parse('dc0da04af8fee58593442bf834b30739');
};

AesUtil.prototype.encrypt = (plainText) => {
  const encrypted = CryptoJS.AES.encrypt(
    plainText,
    this.key,
    {
      iv: this.iv,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = (cipherText) => {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    this.key,
    { iv: this.iv },
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default AesUtil;
