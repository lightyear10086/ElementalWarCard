const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_youlinjingye= class m_youlinjingye extends Mark{
    constructor(){
        super(0,0,0,"幽林静野","【驻军】当你在此标记所属的元素区停留2回合以上，每回合凝聚阶段开始时+2生命，4回合后改为+4生命",6);
        this.lastplayerarea=null;
        this.keepareaturns=0;
    }
    
    events = {
        onSet(self){
            if(self.elementArea==GameStatic.Part_Mu){
                self.keepTurns=8;
            }
        },
        //凝聚阶段
        onCondensation: function (self) {
            if(self.controllPlayer.area==self.lastplayerarea){
                self.keepareaturns++;
            }
            console.log("幽林静野，触发回合数:",self.keepareaturns);
            if(self.keepareaturns>=2 && self.keepareaturns<4){
                self.controllPlayer.HP+=2;
            }else if(self.keepareaturns>=4){
                self.controllPlayer.HP+=4;
            }
            //TODO
        },
        //移动阶段
        onMove: function (self) {
            //TODO
            
        },
        //出牌阶段
        onPlayHand: function (self) {
            //TODO

        },
        //结束阶段
        onFinish: function (self) {
            //TODO
            self.lastplayerarea=self.controllPlayer.area;
        },
        onPlayerMove:function(self,moveplayer,startarea,endarea){
            if(startarea!=endarea){
                self.keepareaturns=0;
            }
        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        }
    }
}