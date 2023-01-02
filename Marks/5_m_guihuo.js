let Mark= require('../MarkClass').Mark;
exports.m_guihuo= class m_guihuo extends Mark{
    constructor(){
        super(0,0,0,"鬼火","敌人受伤时，你+1火元素",3);
    }
    
    events = {
        onSet(self){
            
        },
        //凝聚阶段
        onCondensation: function (self) {
            //TODO
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
            if(changeplayer==self.controllPlayer.enamy){
                self.controllPlayer.pointHuo+=1;
            }
        }
    }
}