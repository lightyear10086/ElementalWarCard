const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_jici= class m_jici extends Mark{
    constructor(){
        super(0,0,0,"棘刺","回合开始时，对敌人造成1伤害，此标记位于【金元素区】时，改为造成2伤害",3);
    }
    
    events = {
        onSet(self){
            
        },
        //凝聚阶段
        onCondensation: function (self) {
            //TODO
            if(self.elementArea==GameStatic.Part_Jin){
                self.controllPlayer.enamy.HP-=2;
            }else{
                self.controllPlayer.enamy.HP--;
            }
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
        onFinish: function () {
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