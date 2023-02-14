const { GameStatic } = require('../GameStatic');

let Mark= require('../MarkClass').Mark;
exports.m_huoyan= class m_huoyan extends Mark{
    constructor(){
        super(0,0,0,"火焰","①【进场】时，你所有【火元素区】的标记+1持续度<br>②敌人移动到【火元素区】时，受到该元素区下标记数量的伤害",2);
    }
    onSet(){
        super.onSet();
        //console.log(this.maincontroll.landList[3]);
        for(let i of this.maincontroll.landList[3].getMarkList1()){
            
            if(i.controllPlayer==this.controllPlayer){
                i.keepTurns++;
            }
        }
        for(let j of this.maincontroll.landList[3].getMarkList2()){
            
            if(j.controllPlayer==this.controllPlayer){
                j.keepTurns++;
            }
        }
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