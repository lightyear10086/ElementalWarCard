const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
let effect_cantputmark=require('../Effects/effect_cantputmark.js').effect_cantputmark;
exports.m_jinmojiejie= class m_jinmojiejie extends Mark{
    constructor(){
        super(0,0,0,"禁魔结界","敌人禁止在此元素区召唤标记",3);
    }
    onFinish(){
        
    }
    onMove(player_){
        
    }
    onTurnBegin(player_){
    }
    onGetCard(player_,card_){
        
    }
    events = {
        onSet(self){
            self.AddComponent(new effect_cantputmark(self.controllPlayer.enamy,self.elementArea));
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