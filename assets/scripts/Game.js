import Player from './Player';


const { ccclass, property } = cc._decorator;

/**
 * 游戏脚本类
 */
@ccclass
export default class Game extends cc.Component {


    /**@type {cc.Prefab} 星星预制 */
    @property(cc.Prefab)
    starPrefab = null;
    /**@type {cc.Prefab} 分数特效预制 */
    @property(cc.Prefab)
    scoreFXPrefab = null;
    /**@type {Number} 最大星星消失时间 */
    @property
    maxStarDuration = 0;
    /**@type {Number} 最小星星消失时间 */
    @property
    minStarDuration = 0;
    /**@type {cc.Node} 开始按钮节点 */
    @property(cc.Node)
    startBtn = null;
    /**@type {cc.Node} 游戏结束节点 */
    @property(cc.Node)
    gameOverNode = null;
    /**@type {cc.Node} 地面节点 */
    @property(cc.Node)
    ground = null;
    /**@type {Player} 主角Player节点 */
    @property(Player)
    player = null;
    /**@type {cc.Label} 分数文本 */
    @property(cc.Label)
    scoreDisplay = null;
    /**@type {cc.AudioClip} 得分声音 */
    @property({type: cc.AudioClip})
    scoreAudio = null;


    /**@type {Number} 地面Y位置 */
    groundY = 0;
    /**@type {Number} 计时器 */
    timer = 0;
    /**@type {Number} 星星持续时间 */
    starDuration = 0;
    /**@type {Number} 分数 */
    score = 0;
    /**@type {cc.Node} 当前创建的星星 */
    currentStar=null;

    constructor() {
        super();
    }

    onLoad() {
        // 设置地面高
        this.groundY = this.ground.y + this.ground.height / 2;
        // 关闭帧频函数
        this.enabled=false;
    }

    /**
     * 开始游戏
     * @param {cc.Event.EventTouch} event 事件
     */
    onStartGame(event){
        //隐藏开始按钮
        this.startBtn.active=false;
        this.gameOverNode.active=false;
        // 激活帧频函数
        this.enabled=true;
        // 角色运动
        this.player.startMove();
        // 初始化分数信息
        this.score=0;
        this.scoreDisplay.string = 'Score:' + this.score;
        // 创建星星
        this.spawnNewStar();
    }

    update(dt) {
        // 星星持续时间判断
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    /**随机创建星星 */
    spawnNewStar() {
        //创建实例
        let star = cc.instantiate(this.starPrefab);
        this.currentStar=star;
        this.node.addChild(star);
        star.setPosition(this.getNewStarPosition());
        //设置星星的game引用
        star.getComponent('Star').game = this;
        // 星星持续时间
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    /**获得随机星星位置 */
    getNewStarPosition() {
        let ranY = this.groundY + Math.random() * this.player.jumpHeight + 50;
        let ranX = this.node.width * (Math.random() - 0.5);
        return cc.v2(ranX, ranY);
    }

    /**
     * 更新分数
     * @param {cc.Vec2} pos 坐标
     */
    gainScore(pos) {
        this.score++;
        this.scoreDisplay.string = 'Score:' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
        // 播放特效
        let fx=cc.instantiate(this.scoreFXPrefab);
        this.node.addChild(fx);
        fx.setPosition(pos);
    }

    /**游戏结束 */
    gameOver() {
        //停止帧频函数和显示按钮文本
        this.enabled=false;
        this.startBtn.active=true;
        this.gameOverNode.active=true;
        // 角色停止运动，销毁当前星星
        this.player.stopMove();
        this.player.node.setPosition(0,this.groundY);
        this.currentStar.destroy();
    }


}
