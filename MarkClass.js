exports.Mark= class Mark {
    constructor(x, property, card,name,text,keepTurns) {
        this.name = name;
        this.text = text;
        this.refCard = card;
        this.controllPlayer=null;
        this.maincontroll=null;
        this.keepTurns=keepTurns;
        this.keepTurns_=keepTurns;
        this.elementArea=null;
    }
    setController(p_){
        this.controllPlayer=p_;
    }
    get keepTurns(){
        return this.keepTurns_;
    }
    set keepTurns(val){
        this.keepTurns_=val;
        //this.maincontroll.updateMarkInfo();
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
        onFinish: function (self) {
            //TODO
        },
        onPlayerMove:function(self,moveplayer,startarea,endarea){

        },
        onPutMarkToLand:function(self,player_,area_,mark_){
            
        }
    }
}