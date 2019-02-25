
const { ccclass, property } = cc._decorator;

/**
 * 分数特效脚本类
 */
@ccclass
export default class ScoreAnim extends cc.Component {

    constructor() {
        super();
    }

    /**
     * 隐藏移除特效
     */
    onHideFx(){
        this.node.destroy();
    }

}
