const { randomInt } = require('crypto');
var Land=require('../Code/Land').Land;
var SystemCardsDic= require('../Code/SystemCardList').SystemCardsDic;
var SystemCardList=require('../Code/SystemCardList').SystemCardList;
var CardLibrary=require('../Code/CardLibrary').CardLibrary;
var RoundControl=require('../Code/RoundControl').RoundControl;
var NetWorkCenter=require('../Code/NetWorkCenter').NetWorkCenter;
var GameStatic=require('../Code/GameStatic').GameStatic;

exports.MainControl=//主控制器
class MainControl {
    constructor(p1,p2) {
        this.websocket = null;//TODO websocket对象
        this.cardSource = [];//TODO 卡牌资源对象
        this.netWorkCenter = new NetWorkCenter(this);
        this.roundControl = new RoundControl(this);
        this.cardLibrary = new CardLibrary(this.cardSource);
        this.landList = [];
        this.landList.push(new Land(0, GameStatic.Part_Jin));
        this.landList.push(new Land(1, GameStatic.Part_Mu));
        this.landList.push(new Land(2, GameStatic.Part_Shui));
        this.landList.push(new Land(3, GameStatic.Part_Huo));
        this.landList.push(new Land(4, GameStatic.Part_Tu));
        this.p1=p1;
        this.p2=p2;
        //当前回合玩家
        this.roundPlayer=null;
        this.gameCardCount=0;
        this.p1.gamePlayer.GameController=this;
        this.p2.gamePlayer.GameController=this;
        this.gameover=false;
        this.marksid=0;
    }
    PlayerHPChange(p_,offset){
        if(offset>0){
            for(let i of this.landList){
                for(let j of i.getMarkList1()){
                    j.events.onPlayerHpChanged(j,p_,offset);
                }
                for(let k of i.getMarkList2()){
                    k.events.onPlayerHpChanged(k,p_,offset);
                }
            }
        }
    }
    PlayerPointChange(p_,elementType,num_){
        for(let i of this.landList){
            for(let j of i.getMarkList1()){
                j.onPlayerElementPointChange(p_,elementType,num_);
            }
            for(let k of i.getMarkList2()){
                k.onPlayerElementPointChange(p_,elementType,num_);
            }
        }
    }
    gameOver(player_){
        this.gameover=true;
        if(player_==this.p1.gamePlayer && this.p2.gamePlayer.HP>0){
            this.p1.playerSocket.emit('action',{
                'name':'gameover',
                'result':'lose'
            });
            this.p2.playerSocket.emit('action',{
                'name':'gameover',
                'result':'win'
            });
        }else if(player_==this.p2.gamePlayer && this.p1.gamePlayer.HP>0){
            this.p2.playerSocket.emit('action',{
                'name':'gameover',
                'result':'lose'
            });
            this.p1.playerSocket.emit('action',{
                'name':'gameover',
                'result':'win'
            });
        }else if(player_==this.p2.gamePlayer && this.p1.gamePlayer.HP<=0){
            this.p2.playerSocket.emit('action',{
                'name':'gameover',
                'result':'draw'
            });
            this.p1.playerSocket.emit('action',{
                'name':'gameover',
                'result':'draw'
            });
        }
        this.p1.GameOver();
        this.p2.GameOver();
    }
    putMarkToLand(player_,landtype_,mark_){
        if(this.gameover){
            return false;
        }
        for(let i of this.landList){
            for(let j of i.getMarkList1()){
                for(let k of j.components){
                    console.log(k.gameplayer==player_);
                    if(k.name=='禁止在元素区召唤标记' && k.gameplayer==player_ && k.enable && k.landtype==landtype_){
                        return false;
                    }
                }
            }
            for(let j_ of i.getMarkList2()){
                for(let k_ of j_.components){
                    console.log(k_.gameplayer==player_);
                    if(k_.name=='禁止在元素区召唤标记' && k_.gameplayer==player_ && k_.enable && k_.landtype==landtype_){
                        return false;
                    }
                }
            }
        }
        this.marksid++;
        mark_.setController(player_);
        mark_.maincontroll=this;
        mark_.mid=this.marksid;
        mark_.elementArea=landtype_;
        if(landtype_==GameStatic.Part_Jin){
            if(player_==this.p1.gamePlayer){
                this.landList[0].markList1.push(mark_);
                this.p1.gamePlayer.elementalSprite.Jin++;
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_goldenarea_'+this.landList[0].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_goldenarea_'+this.landList[0].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[0].markList2.push(mark_);
                this.p2.gamePlayer.elementalSprite.Jin++;
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_goldenarea_'+this.landList[0].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_goldenarea_'+this.landList[0].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Mu){
            if(player_==this.p1.gamePlayer){
                this.landList[1].markList1.push(mark_);
                this.p1.gamePlayer.elementalSprite.Mu++;
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_woodenarea_'+this.landList[1].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_woodenarea_'+this.landList[1].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[1].markList2.push(mark_);
                this.p2.gamePlayer.elementalSprite.Mu++;
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_woodenarea_'+this.landList[1].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_woodenarea_'+this.landList[1].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Shui){
            if(player_==this.p1.gamePlayer){
                this.landList[2].markList1.push(mark_);
                this.p1.gamePlayer.elementalSprite.Shui++;
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_waterarea_'+this.landList[2].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_waterarea_'+this.landList[2].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[2].markList2.push(mark_);
                this.p2.gamePlayer.elementalSprite.Shui++;
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_waterarea_'+this.landList[2].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_waterarea_'+this.landList[2].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Huo){
            if(player_==this.p1.gamePlayer){
                this.landList[3].markList1.push(mark_);
                this.p1.gamePlayer.elementalSprite.Huo++;
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_firearea_'+this.landList[3].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_firearea_'+this.landList[3].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[3].markList2.push(mark_);
                this.p2.gamePlayer.elementalSprite.Huo++;
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_firearea_'+this.landList[3].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_firearea_'+this.landList[3].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Tu){
            if(player_==this.p1.gamePlayer){
                this.landList[4].markList1.push(mark_);
                this.p1.gamePlayer.elementalSprite.Tu++;
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_landarea_'+this.landList[4].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_landarea_'+this.landList[4].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[4].markList2.push(mark_);
                this.p2.gamePlayer.elementalSprite.Tu++;
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'player_landarea_'+this.landList[4].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text,'mid':mark_.mid},
                    'pos':'enamy_landarea_'+this.landList[4].markList2.length
                });
            }
        }
        for(let i of this.landList){
            for(let j of i.getMarkList1()){
                j.events.onPutMarkToLand(j,player_,landtype_,mark_);
            }
            for(let j of i.getMarkList2()){
                j.events.onPutMarkToLand(j,player_,landtype_,mark_);
            }
        }
        mark_.onSet();
        mark_.events.onSet(mark_);
        return true;
    }
    //给指定玩家手牌发指定牌
    putCard(p,card_,params){
        if(this.gameover){
            return;
        }
        if(card_){
            this.gameCardCount++;
            card_.cid=this.gameCardCount;
            p.gamePlayer.handCardList.push(card_);
            this.roundControl.getCard(p,card_);
            p.playerSocket.emit('action',{
                'name':'getcard',
                'card':card_
            });
            card_.maincontrol=this;
            return card_;
        }
        if(p.gamePlayer.playerCardLibrary.length<=0){
            p.playerSocket.emit('message',{
                'content':'你的牌库空了，HP-1'
            });
            p.gamePlayer.HP--;
            return;
        }
        this.gameCardCount++;
        let randIndex=randomInt(0,p.gamePlayer.playerCardLibrary.length);
        let card__=new SystemCardsDic[p.gamePlayer.playerCardLibrary[randIndex]]();
        card__.cid=this.gameCardCount;
        p.gamePlayer.handCardList.push(card__);
        this.roundControl.getCard(p,card__);
        p.playerSocket.emit('action',{
            'name':'getcard',
            'card':card__
        });
        p.gamePlayer.playerCardLibrary.splice(randIndex,1);
        card__.maincontrol=this;
        return card__;
    }
    updateMarkInfo(){
        for(let i of this.landList){
            for(let j of i.markList1){
                this.p1.playerSocket.emit('action',{
                    'name':'syncmarkinfo',
                    'mark':{'mid':j.mid,'keepturns':j.keepTurns}
                });
                this.p2.playerSocket.emit('action',{
                    'name':'syncmarkinfo',
                    'mark':{'mid':j.mid,'keepturns':j.keepTurns}
                });
            }
            for(let j of i.markList2){
                this.p1.playerSocket.emit('action',{
                    'name':'syncmarkinfo',
                    'mark':{'mid':j.mid,'keepturns':j.keepTurns}
                });
                this.p2.playerSocket.emit('action',{
                    'name':'syncmarkinfo',
                    'mark':{'mid':j.mid,'keepturns':j.keepTurns}
                });
            }
        }
    }
    //游戏开始调用
    gameStart(p){
        //初始化牌库
        this.cardLibrary.putCardAll(this.cardSource);

        //TODO 广播客户端游戏开始
        this.netWorkCenter.sendMsgAll();
        
        if(p==this.p1){
            this.roundPlayer=this.p1;
        }else if(p==this.p2){
            this.roundPlayer=this.p2;
        }
        this.p1.gamePlayer.SyncPlayerInfo();
        this.p2.gamePlayer.SyncPlayerInfo();
        this.roundControl.nextRound();
    }
}