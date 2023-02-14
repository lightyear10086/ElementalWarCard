const { m_huoyan } = require('../Marks/10_m_huoyan');
let Card = require('../CardClass.js').Card;

exports.huoyan = class huoyan extends Card{
    constructor(){
        super(0,null,0,0,0,2,0,0);
        this.name="火焰";
        this.text="【进场】时，你所有【火元素区】的标记+1持续度";
        this.mark=new m_huoyan();
    }
}