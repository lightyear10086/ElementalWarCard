const { GameStatic } = require('../GameStatic');

let Effect= require('../EffectClass.js').Effect;

exports.effect_cantputmark= class effect_cantputmark extends Effect{
    constructor(gameplayer_,landtype_){
        super("禁止在元素区召唤标记",Effect.etypes.keep,Effect.aimtypes.mark);
        this.gameplayer=gameplayer_;
        this.landtype=landtype_;
    }
}