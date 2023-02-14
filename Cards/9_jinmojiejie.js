const { m_jinmojiejie } = require('../Marks/9_m_jinmojiejie');
let Card = require('../CardClass.js').Card;

exports.jinmojiejie = class jinmojiejie extends Card{
    constructor(){
        super(0,null,0,0,0,2,0,0);
        this.name="禁魔结界";
        this.text="敌人禁止在此元素区召唤标记";
        this.mark=new m_jinmojiejie();
    }

}