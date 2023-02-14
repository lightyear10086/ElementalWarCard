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
        this.components=new Array();
    }
    AddComponent(effect_){
        console.log("已附加:",effect_.name);
        for(let i of this.maincontroll.landList){
            for(let j of i.getMarkList1()){
                for(let k of j.components){
                    if(k.name=="禁止在标记上添加效果" && k.mark==this && k.enable){
                        return;
                    }
                }
            }
            for(let t of i.getMarkList2()){
                for(let e of t.components){
                    if(e.name=="禁止在标记上添加效果" && e.mark==this && e.enable){
                        return;
                    }
                }
            }
        }
        this.components.push(effect_);
    }
    RemoveComponent(effect_){
        for(let i in this.components){
            if(this.components[i]==effect_){
                this.components.splice(i,1);
                break;
            }
        }
    }
    setController(p_){
        this.controllPlayer=p_;
    }
    get keepTurns(){
        return this.keepTurns_;
    }
    set keepTurns(val){
        this.keepTurns_=val;
        if(this.maincontroll!=null){
            this.maincontroll.updateMarkInfo();
        }
    }
    onSet(){
        this.maincontroll.updateMarkInfo();
    }
    onFinish(){
        if(this.controllPlayer==this.maincontroll.roundPlayer.gamePlayer){
            this.keepTurns--;
        }
    }
    onTurnBegin(player_){
        
    }
    onGetCard(player_,card_){
        
    }
    onPlayerElementPointChange(p_,elementtype_,num_){

    }
    events = {
        //入场时触发
        onSet:function(self){

        },
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
            
        },
        onBeRemoved:function(self){

        },
        onPlayerHpChanged:function(self,changeplayer,changeval){
            
        },
        onPlayerGetCard:function(self,player_,card_){}
    }
}