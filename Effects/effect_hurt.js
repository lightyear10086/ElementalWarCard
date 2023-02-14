const { GameStatic } = require('../GameStatic');

let Effect= require('../EffectClass').Effect;

class effect_hurt extends Effect{
    constructor(gameplayer_,hurtnum){
        super("伤害",Effect.etypes.immediately,Effect.aimtypes.playerrole);
        this.gameplayer=gameplayer_;
        this.hurtnum=hurtnum;
    }
    effectFunc(){
        this.gameplayer.HP-=this.hurtnum;
    }
}