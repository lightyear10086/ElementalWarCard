let Mark= require('../MarkClass').Mark;
exports.m_tiejili= class m_tiejili extends Mark{
    constructor(){
        super(0,0,0,"铁蒺藜","【敌落】对敌人造成2点伤害",3);
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
        onFinish: function (self) {
            //TODO

        },
        onPlayerMove:function(self,moveplayer,startarea,endarea){
            if(moveplayer==self.controllPlayer.enamy && endarea==self.elementArea){
                moveplayer.HP-=2;
            }
        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        },
        onPlayerHpChanged:function(self,changeplayer,changeval){
            
        }
    }
}