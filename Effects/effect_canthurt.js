const { GameStatic } = require('../GameStatic');

let Effect= require('../EffectClass.js').Effect;

exports.effect_canthurt= class effect_canthurt extends Effect{
    constructor(gameplayer_){
        super("免疫所有伤害",Effect.etypes.keep,Effect.aimtypes.gameplayer);
        this.gameplayer=gameplayer_;
    }
}