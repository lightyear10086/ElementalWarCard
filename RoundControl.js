var GameStatic=require('../Code/GameStatic').GameStatic;

exports.RoundControl=class RoundControl {
    constructor(mainControl) {
        this.mainControl = mainControl;//当前主控制器
        this.roundNum = 0;//当前回合数
        this.roundPartNum = 0;//当前阶段数
        this.roundPart = "";//当前回合阶段(凝聚、移动、出牌、结束)
    }

    //下个回合
    nextRound(){
        if(this.mainControl.gameover){
            return;
        }
        this.roundPart = GameStatic.Part_Condensation;
        this.roundNum++;
        this.roundPartNum = 0;
        
        if(this.roundNum==1){
            this.mainControl.roundPlayer.playerSocket.emit('action',{
                'name':'roundbegin'
            });
            this.mainControl.putCard(this.mainControl.roundPlayer);
            this.mainControl.roundPlayer.enamy.playerSocket.emit('action',{
                'name':'notround'
            });
            this.mainControl.roundPlayer.nowStepinRound=GameStatic.Part_Condensation;
            return;
        }
        if(this.mainControl.p1!=this.mainControl.roundPlayer){
            this.mainControl.p2.playerSocket.emit('action',{
                'name':'notround'
            });
            this.mainControl.p1.playerSocket.emit('action',{
                'name':'roundbegin'
            });
            this.mainControl.p1.gamePlayer.nowStepinRound=GameStatic.Part_Condensation;
            this.mainControl.roundPlayer=this.mainControl.p1;
        }else{
            this.mainControl.p1.playerSocket.emit('action',{
                'name':'notround'
            });
            this.mainControl.p2.playerSocket.emit('action',{
                'name':'roundbegin'
            });
            
            this.mainControl.p2.gamePlayer.nowStepinRound=GameStatic.Part_Condensation;
            this.mainControl.roundPlayer=this.mainControl.p2;
        }
        this.mainControl.putCard(this.mainControl.roundPlayer);
        this.mainControl.roundPlayer.gamePlayer.moveTimes=1;
    }

    //下个阶段
    nextPart(){
        if(this.mainControl.gameover){
            return;
        }
        this.roundPartNum++;
        console.log("阶段数:",this.roundPartNum);
        if(this.roundPartNum == 0){
            this.roundPart = GameStatic.Part_Condensation;
            this.dealPartCondensationEvent();
        }else if(this.roundPartNum == 1){
            this.roundPart = GameStatic.Part_Move;
            this.dealPartMoveEvent();
        }else if(this.roundPartNum == 2){
            this.roundPart = GameStatic.Part_PlayHand;
            this.dealPartPlayHandEvent();
        }else if(this.roundPartNum == 3){
            this.roundPart = GameStatic.Part_Finish;
            this.dealPartFinishEvent();
        }else{
            this.nextRound();
        }
    }

    //凝聚阶段事件
    dealPartCondensationEvent(){
        if(this.mainControl.gameover){
            return;
        }
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1[j].events.onCondensation(markList1[j]);
            }
            for(let j=0;j<markList2.length;j++){
                markList2[j].events.onCondensation(markList2[j]);
            }
        }
        this.mainControl.roundPlayer.gamePlayer.CollectElement(this.mainControl.roundPlayer.gamePlayer.area);
    }

    //移动阶段事件
    dealPartMoveEvent(){
        if(this.mainControl.gameover){
            return;
        }
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1[j].events.onMove();
            }
            for(let j=0;j<markList2.length;j++){
                markList2[j].events.onMove();
            }
        }
    }
    //玩家角色移动事件
    dealPartPlayerMoveEvent(player_,startarea_,endarea_){
        if(this.mainControl.gameover){
            return;
        }
        const landList=this.mainControl.landList;
        for(let i of landList){
            let markList1=i.getMarkList1();
            let markList2=i.getMarkList2();
            for(let j of markList1){
                j.events.onPlayerMove(j,player_,startarea_,endarea_);
            }
            for(let j of markList2){
                j.events.onPlayerMove(j,player_,startarea_,endarea_);
            }
        }
    }

    //出牌阶段事件
    dealPartPlayHandEvent(){
        if(this.mainControl.gameover){
            return;
        }
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1[j].events.onPlayHand();
            }
            for(let j=0;j<markList2.length;j++){
                markList2[j].events.onPlayHand();
            }
        }
    }

    //结束阶段事件
    dealPartFinishEvent(){
        if(this.mainControl.gameover){
            return;
        }
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1[j].events.onFinish(markList1[j]);
                markList1[j].keepTurns--;
            }
            for(let j=0;j<markList2.length;j++){
                markList2[j].events.onFinish(markList2[j]);
                markList2[j].keepTurns--;
            }
            for(let j in markList1){
                console.log("标记剩余:",markList1[j].keepTurns);
                if(markList1[j].keepTurns<=0){
                    this.mainControl.p1.playerSocket.emit('action',{
                        'name':'removemark',
                        'mark':markList1[j].mid
                    });
                    this.mainControl.p2.playerSocket.emit('action',{
                        'name':'removemark',
                        'mark':markList1[j].mid
                    });
                    markList1.splice(j,1);
                }
            }
            for(let j in markList2){
                if(markList2[j].keepTurns<=0){
                    this.mainControl.p1.playerSocket.emit('action',{
                        'name':'removemark',
                        'mark':markList2[j].mid
                    });
                    this.mainControl.p2.playerSocket.emit('action',{
                        'name':'removemark',
                        'mark':markList2[j].mid
                    });
                    markList2.splice(j,1);
                }
            }
        }
    }
}