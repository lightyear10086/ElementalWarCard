const { m_youlinjingye } = require('../Marks/4_m_youlinjingye.js');

let Card = require('../CardClass.js').Card;

exports.youlinjingye = class youlinjingye extends Card{
    constructor(){
        super(0,null,0,0,6,3,0,0);
        this.name="幽林静野";
        this.text="【驻军】当你在此标记所属的元素区停留2回合以上，每回合凝聚阶段开始时+2生命，4回合后改为+4生命";
        this.mark=new m_youlinjingye();
    }

}