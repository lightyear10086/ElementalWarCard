const { GameStatic } = require('../GameStatic');

let Effect= require('../EffectClass').Effect;

exports.effect_cantaddcomponent=class effect_cantaddcomponent extends Effect{
    constructor(mark_){
        super("禁止在标记上添加效果",Effect.etypes.keep,Effect.aimtypes.mark);
        this.mark=mark_;
    }
}