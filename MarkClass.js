exports.Mark= class Mark {
    constructor(x, property, card,name,text,keepTurns) {
        this.name = name;
        this.text = text;
        this.refCard = card;
        this.controllPlayer=null;
        this.maincontroll=null;
        this.keepTurns=keepTurns;
    }
    setController(p_){
        this.controllPlayer=p_;
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
        onPlayerMove:function(self,moveplayer,startarea,endarea){

        }
    }
}