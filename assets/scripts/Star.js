
const { ccclass, property } = cc._decorator;

/**
 * 星星脚本类
 */
@ccclass
export default class Star extends cc.Component {

    /**@type {Number} 星星和主角碰撞距离 */
    @property
    pickRadius = 0;

    constructor() {
        super();
    }

    update(dt) {
        //设置透明度
        let opacityRatio=1-this.game.timer/this.game.starDuration;
        let minOpacity=50;
        this.node.opacity=minOpacity+Math.floor(opacityRatio*(255-minOpacity));
        // 收集判断
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }
    }

    /**获得星星和主角的距离 */
    getPlayerDistance() {
        let playerPos = this.game.player.node.getPosition();
        let dis = this.node.position.sub(playerPos).mag();
        return dis;
    }

    /**收集星星 */
    onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore(this.node.getPosition());
        this.node.destroy();
    }

}
