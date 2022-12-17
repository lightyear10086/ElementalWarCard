exports.Mark= class Mark {
    constructor(x, property, card,name,text) {
        this.name = name;
        this.text = text;
        this.refCard = card;
        this.controllPlayer=null;
        this.maincontroll=null;
    }
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