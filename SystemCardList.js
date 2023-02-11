const { guihuo } = require('./Cards/5_guihuo');
const { jici } = require('./Cards/6_jici');
const { huanjinzhefeiao } = require('./Cards/7_huanjinzhefeiao');

let zhouchaoganghua= require('../Code/Cards/1_zhouchaoganghua').zhouchaoganghua;
let chianyanzhong= require('../Code/Cards/2_chianyanzhong').chianyanzhong;
let tiejili=require('../Code/Cards/3_tiejili').tiejili;
let youlinjingye=require('../Code/Cards/4_youlinjingye').youlinjingye;
exports.SystemCards={zhouchaoganghua,chianyanzhong,tiejili,youlinjingye,guihuo,jici,huanjinzhefeiao};
exports.SystemCardsDic={
    '咒潮钢华':zhouchaoganghua,
    '炽暗焰冢':chianyanzhong,
    '铁蒺藜':tiejili,
    '幽林静野':youlinjingye,
    '鬼火':guihuo,
    '棘刺':jici,
    "唤金者菲奥":huanjinzhefeiao
}