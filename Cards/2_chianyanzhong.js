let Card= require('../CardClass.js').Card;
exports.chianyanzhong= class chianyanzhong extends Card{
    constructor(){
        super(0,null,0,0,0,0,5,0);
        this.name="炽暗焰冢";
        this.text="对手移动时，受到2点火元素伤害"
    }
}
