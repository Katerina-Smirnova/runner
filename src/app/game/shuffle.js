export default class Shuffle{
    randomInt(min,max){
        return Math.floor(Math.random() * (max - min+1)) + min;
    }
    randomDirection(){
        return Math.random()<0.5 ? -1 : 1;
    }
}
