var GameStatic=require('../Code/GameStatic').GameStatic;
//对局玩家
exports.Player= class Player {
    constructor(socket_) {
        this.sock=socket_;
        this.HP = GameStatic.HP;
        this.HP_=GameStatic.HP;
        this.pointJin = 0;
        this.pointJin_=0;
        this.pointMu = 0;
        this.pointMu_=0;
        this.pointShui = 0;
        this.pointShui_=0;
        this.pointHuo = 0;
        this.pointHuo_=0;
        this.pointTu = 0;
        this.pointTu_=0;
        this.area=null;
        this.area_=null;
        this.handCardList = new Array();
        this.playerCardLibrary=new Array();
        this.enamy=null;
        
        this.nowStepinRound=GameStatic.Part_Condensation;
        this.GameController=null;

        this.canCollectElement_Jin=true;//玩家是否能凝聚金元素
        this.collectElementCount_Jin=2;//玩家在凝聚阶段能凝聚多少金元素
        this.canCollectElement_Mu=true;//玩家是否能凝聚金元素
        this.collectElementCount_Mu=2;//玩家在凝聚阶段能凝聚多少金元素
        this.canCollectElement_Shui=true;//玩家是否能凝聚金元素
        this.collectElementCount_Shui=2;//玩家在凝聚阶段能凝聚多少金元素
        this.canCollectElement_Huo=true;//玩家是否能凝聚金元素
        this.collectElementCount_Huo=2;//玩家在凝聚阶段能凝聚多少金元素
        this.canCollectElement_Tu=true;//玩家是否能凝聚金元素
        this.collectElementCount_Tu=2;//玩家在凝聚阶段能凝聚多少金元素
    }
    UseCardFromHand(card_,aimpos){
        if(this.handCardList.indexOf(card_)<0){
            console.log("返回");
            return;
        }
        if(this.pointJin>=card_.cost.Jin && this.pointMu>=card_.cost.Mu && this.pointShui>=card_.cost.Shui && this.pointHuo>=card_.cost.Huo && this.pointTu>=card_.cost.Tu){
            this.pointJin-=card_.cost.Jin;
            this.pointMu-=card_.cost.Mu;
            this.pointShui-=card_.cost.Shui;
            this.pointHuo-=card_.cost.Huo;
            this.pointTu-=card_.cost.Tu;
            this.sock.emit('action',{
                'name':'usecardfromhand',
                'card':card_.cid
            });
            console.log("玩家手牌",this.handCardList.length);
            this.handCardList.splice(this.handCardList.indexOf(card_),1);
            console.log("玩家剩余手牌",this.handCardList.length);

            if(this.GameController!=null && card_.mark!=null){
                let landtype_=null;
                switch(aimpos.split('_')[1].split('area')[0]){
                    case "golden":
                        landtype_=GameStatic.Part_Jin;
                        break;
                    case "wooden":
                        landtype_=GameStatic.Part_Mu;
                        break;
                    case "water":
                        landtype_=GameStatic.Part_Shui;
                        break;
                    case "fire":
                        landtype_=GameStatic.Part_Huo;
                        break;
                    case "land":
                        landtype_=GameStatic.Part_Tu;
                        break;
                }
                this.GameController.putMarkToLand(this,landtype_,card_.mark);
            }
            return true;
        }
        console.log("返回2");
        return false;
    }
    CollectElement(elementtype,count){
        console.log("玩家位于",elementtype,GameStatic.Part_Jin);
        if(elementtype==GameStatic.Part_Jin){
            if(this.canCollectElement_Jin){
                this.pointJin+=this.collectElementCount_Jin;
            }
        }
        if(elementtype==GameStatic.Part_Mu){
            if(this.canCollectElement_Mu){
                this.pointMu+=this.collectElementCount_Mu;
            }
        }
        if(elementtype==GameStatic.Part_Shui){
            if(this.canCollectElement_Shui){
                this.pointShui+=this.collectElementCount_Shui;
            }
        }
        if(elementtype==GameStatic.Part_Huo){
            if(this.canCollectElement_Huo){
                this.pointHuo+=this.collectElementCount_Huo;
            }
        }
        if(elementtype==GameStatic.Part_Tu){
            if(this.canCollectElement_Tu){
                this.pointTu+=this.collectElementCount_Tu;
            }
        }
    }

    SyncPlayerInfo(){
        this.sock.emit('action',{
            'name':'sync',
            'Jin':this.pointJin,
            'Mu':this.pointMu,
            'Shui':this.pointShui,
            'Huo':this.pointHuo,
            'Tu':this.pointTu,
            'HP':this.HP
        })
    }
    get HP(){
        return this.HP_;
    }
    set HP(val){
        this.HP_=val;
        this.SyncPlayerInfo();
    }
    get pointJin(){
        return this.pointJin_;
    }
    set pointJin(val){
        this.pointJin_=val;
        this.SyncPlayerInfo();
    }
    get pointMu(){
        return this.pointMu_;
    }
    set pointMu(val){
        this.pointMu_=val;
        this.SyncPlayerInfo();
    }
    get pointShui(){
        return this.pointShui_;
    }
    set pointShui(val){
        this.pointShui_=val;
        this.SyncPlayerInfo();
    }
    get pointHuo(){
        return this.pointHuo_;
    }
    set pointHuo(val){
        this.pointHuo_=val;
        this.SyncPlayerInfo();
    }
    get pointTu(){
        return this.pointTu_;
    }
    set pointTu(val){
        this.pointTu_=val;
        this.SyncPlayerInfo();
    }
    
    get area(){
        return this.area_;
    }
    set area(val){
        if(val!=null){
            this.area_=val;
        }
    }

    getHandCardList() {
        return this.handCardList;
    }
    TurnBegin(){

    }
    EndTurn(){
        this.GameController.roundControl.nextRound();
    }
}