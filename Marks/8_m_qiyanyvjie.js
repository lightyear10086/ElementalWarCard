const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_qiyanyvjie= class m_qiyanyvjie extends Mark{
    constructor(){
        super(0,0,0,"契炎御结","【仅能召唤于火元素区】当你消耗火元素时，+2生命",5);
    }
    onMove(player_){
        
    }
    onTurnBegin(player_){
    }
    onGetCard(player_,card_){
        
    }
    onPlayerElementPointChange(p_,elementtype_,num_){
        if(p_==this.controllPlayer && elementtype_==GameStatic.Part_Huo && num_<0){
            this.controllPlayer.HP+=2;
        }
    }
    events = {
        onSet(self){
            
        },
        //凝聚阶段
        onCondensation: function (self) {
            
        },
        //移动阶段
        onMove: function (self) {
            //TODO
            
        },
        //出牌阶段
        onPlayHand: function () {
            //TODO

        },
        //结束阶段
        onFinish: function (self) {
            //TODO

        },
        onPlayerMove:function(self,moveplayer,startarea,endarea){
            
        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        },
        onPlayerHpChanged:function(self,changeplayer,changeval){
            
        }
    }
}