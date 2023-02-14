const { m_qiyanyvjie } = require('../Marks/8_m_qiyanyvjie');


let Card = require('../CardClass.js').Card;

exports.qiyanyvjie = class qiyanyvjie extends Card{
    constructor(){
        super(0,null,0,0,0,0,4,0);
        this.name="契炎御结";
        this.text="【仅能召唤于火元素区】但你消耗火元素时，+2生命";
        this.mark=new m_qiyanyvjie();
    }

}