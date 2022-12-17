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
    }

    //下个阶段
    nextPart(){
        this.roundPartNum++;
        if(this.roundPartNum == 1){
            this.roundPart = GameStatic.Part_Condensation;
            this.dealPartCondensationEvent();
        }else if(this.roundPartNum == 2){
            this.roundPart = GameStatic.Part_Move;
            this.dealPartMoveEvent();
        }else if(this.roundPartNum == 3){
            this.roundPart = GameStatic.Part_PlayHand;
            this.dealPartPlayHandEvent();
        }else if(this.roundPartNum == 4){
            this.roundPart = GameStatic.Part_Finish;
            this.dealPartFinishEvent();
        }else{
            this.nextRound();
        }
    }

    //凝聚阶段事件
    dealPartCondensationEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onCondensation();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onCondensation();
            }
        }
        this.mainControl.roundPlayer.gamePlayer.CollectElement(this.mainControl.roundPlayer.gamePlayer.area);
    }

    //移动阶段事件
    dealPartMoveEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onMove();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onMove();
            }
        }
    }

    //出牌阶段事件
    dealPartPlayHandEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onPlayHand();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onPlayHand();
            }
        }
    }

    //结束阶段事件
    dealPartFinishEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onFinish();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onFinish();
            }
        }
        
    }
}