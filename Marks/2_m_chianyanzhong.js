let Mark= require('../MarkClass').Mark;
exports.m_chianyanzhong= class m_chianyanzhong extends Mark{
    constructor(){
        super(0,0,0,"炽暗焰冢","敌人移动时，受到1点伤害",5);
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
            if(moveplayer==self.controllPlayer.enamy){
                moveplayer.HP--;
            }
        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        }
    }
}