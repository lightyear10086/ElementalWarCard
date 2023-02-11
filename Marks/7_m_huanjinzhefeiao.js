const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_huanjinzhefeiao= class m_huanjinzhefeiao extends Mark{
    constructor(){
        super(0,0,0,"唤金者菲奥","①唤金者菲奥只会在你移动时减少1点维持度。<br>②回合开始时，你+1金元素。<br>你手牌中所有需要消耗金元素的牌-1金元素消耗。",5);
    }
    onFinish(){
        
    }
    onMove(player_){
        if(player_==this.controllPlayer){
            this.keepTurns--;
        }
    }
    onTurnBegin(player_){
        if(player_==this.controllPlayer){
            player_.pointJin++;
        }
    }
    onGetCard(player_,card_){
        console.log("是否相等",player_.gamePlayer==this.controllPlayer);
        if(player_.gamePlayer==this.controllPlayer){
            console.log("菲奥触发",card_.cost);
            if(card_.cost.Jin>0){
                card_.cost.Jin--;
            }
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