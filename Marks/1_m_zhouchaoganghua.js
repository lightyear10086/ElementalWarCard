let Mark= require('../MarkClass').Mark;
exports.m_zhouchaoganghua= class m_zhouchaoganghua extends Mark{
    constructor(){
        super(0,0,0,"咒潮钢华","在你的回合，凝聚阶段结束时，无论你位于哪个元素区，额外凝聚1点【金元素】");
        console.trace("已创建咒潮钢华");
    }
    
    events = {
        //凝聚阶段
        onCondensation: function (self) {
            //TODO
            if(self.maincontroll.roundPlayer.gamePlayer==self.controllPlayer){
                self.controllPlayer.pointJin++;
            }
            
        },
        //移动阶段
        onMove: function () {
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
    }
}