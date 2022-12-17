exports.CardLibrary=//牌库
class CardLibrary {
    constructor(cardSource) {
        this.cards = [];
        this.cardSource = cardSource;
    }

    //添加一张牌到牌库
    putCard(card){
        this.cards.push(card);
    }

    //添加一张牌到牌库
    putCardAll(cardList){
        for(let i=0; i<cardList.length; i++){
            this.cards.push(cardList[i]);
        }
    }

    //抽一张牌
    getCard(){
        const card = this.cards[this.cards.length-1];
        this.cards.splice(this.cards.length-1, 1);
        return card;
    }
}