import { Sm3Utils, Sm2Utils } from '@/util/utils/SmCrypto'
//const pub = '04E9D0B005EC38A59FC1A68440A3332B612D62470461EFA8875E81393201BD9F47FB0EE08E519974D773DB9BB73605ACDB127BA51492E5797CE5DF578CC132FB19'
var sm2Utils = new Sm2Utils()
export function encryptPw(pub,pw) {
  return sm2Utils.encryptFromText(pub, pw)
}

