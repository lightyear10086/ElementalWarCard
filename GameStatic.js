exports.GameStatic=class GameStatic {
    //是否异步处理网络消息
    static MessageAsync = false;
    //玩家血量
    static HP = 10;
    //玩家初始手牌数
    static HandCardLimit = 5;
    //凝聚阶段
    static Part_Condensation = "Condensation";
    //移动阶段
    static Part_Move = "Move";
    //出牌阶段
    static Part_PlayHand = "PlayHand";
    //结束阶段
    static Part_Finish = "Finish";
    //属性-金
    static Part_Jin = "Jin";
    //属性-木
    static Part_Mu = "Mu";
    //属性-水
    static Part_Shui = "Shui";
    //属性-火
    static Part_Huo = "Huo";
    //属性-土
    static Part_Tu = "Tu";
}