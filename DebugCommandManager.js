const { effect_canthurt } = require('./Effects/effect_canthurt');

var SystemCardsDic= require('../Code/SystemCardList').SystemCardsDic;
var SystemCardList=require('../Code/SystemCardList').SystemCardList;

exports.debugManager=class debugManager{
    constructor(gamecontroller){
        this.gamecontroller=gamecontroller;
    }
    runCommand(command,player__){
        if(player__==null){
            return;
        }
        let player_=player__.gamePlayer;
        let cmdparts=command.split(' ');
        console.log(cmdparts);
        switch(cmdparts[0]){
            case 'godmode':
                player_.pointJin=999;
                player_.pointMu=999;
                player_.pointShui=999;
                player_.pointHuo=999;
                player_.pointTu=999;
                player_.HP=999;
                player_.AddEffect(new effect_canthurt(player_));
                break;
            case 'point':
                if(cmdparts[1]=='jin'){
                    player_.pointJin=parseInt(cmdparts[2]);
                }
                else if(cmdparts[1]=='mu'){
                    player_.pointMu=parseInt(cmdparts[2]);
                }else if(cmdparts[1]=='shui'){
                    player_.pointShui=parseInt(cmdparts[2]);
                }else if(cmdparts[1]=='huo'){
                    player_.pointHuo=parseInt(cmdparts[2]);
                }else if(cmdparts[1]=='tu'){
                    player_.pointTu=parseInt(cmdparts[2]);
                }else if(cmdparts[1]=='all'){
                    player_.pointJin=parseInt(cmdparts[2]);
                    player_.pointMu=parseInt(cmdparts[2]);
                    player_.pointShui=parseInt(cmdparts[2]);
                    player_.pointHuo=parseInt(cmdparts[2]);
                    player_.pointTu=parseInt(cmdparts[2]);
                }
                break;
            case 'HP':
                player_.HP=parseInt(cmdparts[1]);
                break;
            case 'getcard':
                if(cmdparts[1]=='rand'){
                    this.gamecontroller.putCard(player__);
                }else{
                    this.gamecontroller.putCard(player__,new SystemCardsDic[cmdparts[1]]());
                }
                break;
        }
    }
}