let Card = require('../CardClass.js').Card;

exports.zhouchaoganghua = class zhouchaoganghua extends Card{
    constructor(){
        super(0,null,0,3,0,0,0,0);
        this.name="咒潮钢华";
        this.text="在你的凝聚阶段结束时，你+1金元素"
    }

}