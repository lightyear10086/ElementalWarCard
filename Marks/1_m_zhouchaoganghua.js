const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_zhouchaoganghua= class m_zhouchaoganghua extends Mark{
    constructor(){
        super(0,0,0,"咒潮钢华","①你每移动1次，【咒潮钢华】+1维持度，你获得2点金元素<br>②当你移动到【金】元素区时，对敌人造成3点伤害",4);
    }
    
    events = {
        onSet(self){
            
        },
        //凝聚阶段
        onCondensation: function (self) {
            
            
        },
        //移动阶段
        onMove: function () {
            //TODO

        },
        //出牌阶段
        onPlayHand: function () {
            //TODO

        },
        onPlayerMove:function(self,moveplayer,startarea,endarea){
            if(moveplayer==self.controllPlayer){
                self.keepTurns++;
                self.controllPlayer.pointJin+=2;
            }
            if(endarea==GameStatic.Part_Jin){
                self.controllPlayer.enamy.HP-=3;
            }
        },
        //结束阶段
        onFinish: function (self) {
            //TODO

        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        },
        onPlayerHpChanged:function(self,changeplayer,changeval){
            
        }
    }
}