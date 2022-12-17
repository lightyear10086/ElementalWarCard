exports.Land=class Land {
    constructor(x, property) {
        this.x = x;
        this.property = property; //属性
        this.markList1 = []; //己方的标记集合
        this.markList2 = []; //对方的标记集合
        this.markPlayerList=[];//地块上的玩家列表
    }

    getMarkList1() {
        return this.markList1;
    }

    getMarkList2() {
        return this.markList2;
    }
}