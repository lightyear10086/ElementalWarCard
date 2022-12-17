var GameStatic=require('../Code/GameStatic').GameStatic;
//卡牌
exports.Card= class Card {
    constructor(x, property,costx,cost_jin,cost_mu,cost_shui,cost_huo,cost_tu) {
        this.name = "";
        this.text = "";
        this.mark=null;
        this.maincontroll=null;
        this.cost={'x':costx,'Jin':cost_jin,'Mu':cost_mu,'Shui':cost_shui,'Huo':cost_huo,'Tu':cost_tu}
    }

    //各阶段结算效果回调
    events = {
        //凝聚阶段
        onCondensation: function () {
            //TODO
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