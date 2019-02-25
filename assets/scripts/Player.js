
const { ccclass, property } = cc._decorator;

/**
 * 角色脚本类
 */
@ccclass
export default class Player extends cc.Component {

    /**@type {Number} 跳跃高度 */
    @property
    jumpHeigh = 0;
    /**@type {Number} 跳跃持续时间 */
    @property
    jumpDuration = 0;
    /**@type {Number} 最大移动速度 */
    @property
    maxMoveSpeed = 0;
    /**@type {Number} 加速度 */
    @property
    accel = 0;
    /**@type {cc.AudioClip} 跳跃声音 */
    @property({ type: cc.AudioClip })
    jumpAudio = null;

    /**@type {Number} 加速度方向左 */
    accelLeft = false;
    /**@type {Number} 加速度方向右 */
    accelRight = false;
    /**@type {Number} X轴速度 */
    xSpeed = 0;

    constructor() {
        super();
    }


    onLoad() {
        // 关闭帧频函数
        this.enabled = false;
        // 注册事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        let touchReceive = cc.Canvas.instance.node;
        touchReceive.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        touchReceive.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 开始移动
     */
    startMove() {
        // 激活帧频函数
        this.enabled = true;
        //初始化跳跃动作
        let jumpAction = this.setJumpAction();
        this.node.runAction(jumpAction);
    }

    /**
     * 停止移动
     */
    stopMove() {
        // 关闭帧频函数
        this.enabled = false;
        //停止所有动作
        this.node.stopAllActions();
    }

    update(dt) {
        //判断方向计算加速度
        if (this.accelLeft) {
            this.xSpeed = -this.accel * dt;
        }
        else if (this.accelRight) {
            this.xSpeed = this.accel * dt;
        }
        //判断是否超过地图边界
        if(this.node.x<=-cc.winSize.width/2||this.node.x>=cc.winSize.width/2){
            this.xSpeed*=-1;
        }
        // 限制速度最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        //更新位置
        this.node.x += this.xSpeed;
    }

    onDestroy() {
        // 移除事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        let touchReceive = cc.Canvas.instance.node;
        touchReceive.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        touchReceive.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**设置跳跃动作 */
    setJumpAction() {
        // 跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeigh)).easing(cc.easeCubicActionOut());
        // 跳跃下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeigh)).easing(cc.easeCubicActionIn());
        // 播放音效
        let callback = cc.callFunc(this.playJumpSound, this);
        // 重复动作
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    /**播放跳跃音效 */
    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    /**
     * 键盘按下
     * @param {cc.Event.EventKeyboard} event 事件
     */
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accelLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accelRight = true;
                break;
        }
    }

    /**
     * 键盘释放
     * @param {cc.Event.EventKeyboard} event 事件
     */
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accelLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accelRight = false;
                break;
        }
    }

    /**
     * 触摸屏幕按下
     * @param {cc.Event.EventTouch} event 事件
     */
    onTouchStart(event) {
        // 获得点击位置
        let touchLoc=event.getLocation();
        // 判断点击屏幕左侧还是右侧
        if(touchLoc.x>=cc.winSize.width/2){//右侧
            this.accelLeft=false;
            this.accelRight=true;
        }
        else{//左侧
            this.accelLeft=true;
            this.accelRight=false;
        }
    }


    /**
     * 触摸屏幕释放
     * @param {cc.Event.EventTouch} event 事件
     */
    onTouchEnd(event) {
        // 重置状态
        this.accelLeft=false;
        this.accelRight=false;
    }

}
