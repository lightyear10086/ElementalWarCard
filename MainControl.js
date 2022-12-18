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
    }
    gameOver(player_){
        this.gameover=true;
        if(player_==this.p1.gamePlayer && this.p2.gamePlayer.HP>0){
            this.p1.emit('action',{
                'name':'gameover',
                'result':'lose'
            });
            this.p2.emit('action',{
                'name':'gameover',
                'result':'win'
            });
        }else if(player_==this.p2.gamePlayer && this.p1.gamePlayer.HP>0){
            this.p2.emit('action',{
                'name':'gameover',
                'result':'lose'
            });
            this.p1.emit('action',{
                'name':'gameover',
                'result':'win'
            });
        }else if(player_==this.p2.gamePlayer && this.p1.gamePlayer.HP<=0){
            this.p2.emit('action',{
                'name':'gameover',
                'result':'draw'
            });
            this.p1.emit('action',{
                'name':'gameover',
                'result':'draw'
            });
        }
    }
    putMarkToLand(player_,landtype_,mark_){
        if(this.gameover){
            return;
        }
        mark_.setController(player_);
        mark_.maincontroll=this;
        if(landtype_==GameStatic.Part_Jin){
            if(player_==this.p1.gamePlayer){
                this.landList[0].markList1.push(mark_);
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_goldenarea_'+this.landList[0].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_goldenarea_'+this.landList[0].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[0].markList2.push(mark_);
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_goldenarea_'+this.landList[0].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_goldenarea_'+this.landList[0].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Mu){
            if(player_==this.p1.gamePlayer){
                this.landList[1].markList1.push(mark_);
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_woodenarea_'+this.landList[1].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_woodenarea_'+this.landList[1].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[1].markList2.push(mark_);
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_woodenarea_'+this.landList[1].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_woodenarea_'+this.landList[1].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Shui){
            if(player_==this.p1.gamePlayer){
                this.landList[2].markList1.push(mark_);
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_waterarea_'+this.landList[2].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_waterarea_'+this.landList[2].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[2].markList2.push(mark_);
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_waterarea_'+this.landList[2].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_waterarea_'+this.landList[2].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Huo){
            if(player_==this.p1.gamePlayer){
                this.landList[3].markList1.push(mark_);
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_firearea_'+this.landList[3].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_firearea_'+this.landList[3].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[3].markList2.push(mark_);
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_firearea_'+this.landList[3].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_firearea_'+this.landList[3].markList2.length
                });
            }
        }
        if(landtype_==GameStatic.Part_Tu){
            if(player_==this.p1.gamePlayer){
                this.landList[4].markList1.push(mark_);
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_landarea_'+this.landList[4].markList1.length
                });
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_landarea_'+this.landList[4].markList1.length
                });
            }else if(player_==this.p2.gamePlayer){
                this.landList[4].markList2.push(mark_);
                this.p2.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'player_landarea_'+this.landList[4].markList2.length
                });
                this.p1.playerSocket.emit('action',{
                    'name':'putmark',
                    'mark':{'name':mark_.name,'text':mark_.text},
                    'pos':'enamy_landarea_'+this.landList[4].markList2.length
                });
            }
        }
    }
    //给指定玩家手牌发指定牌
    putCard(p,card_,params){
        if(this.gameover){
            return;
        }
        if(card_){
            this.gameCardCount++;
            p.gamePlayer.handCardList.push(card_);
            card_.cid=this.gameCardCount;
            p.gamePlayer.playerSocket.emit('action',{
                'name':'getcard',
                'card':JSON.stringify(card_)
            });
            return card_;
        }
        if(p.gamePlayer.playerCardLibrary.length<=0){
            return;
        }
        this.gameCardCount++;
        let randIndex=randomInt(0,p.gamePlayer.playerCardLibrary.length);
        let card__=new SystemCardsDic[p.gamePlayer.playerCardLibrary[randIndex]]();
        card__.cid=this.gameCardCount;
        p.gamePlayer.handCardList.push(card__);
        p.playerSocket.emit('action',{
            'name':'getcard',
            'card':card__
        });
        p.gamePlayer.playerCardLibrary.splice(randIndex,1);
        card__.maincontrol=this;
        return card__;
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
        this.roundControl.nextRound();
    }
}