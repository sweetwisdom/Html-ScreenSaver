/**
 * 翻页动画控制器
 * 负责管理翻页动画状态和时序
 */

/**
 * 缓动函数：ease-out-cubic
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 单个翻页动画
 */
class FlipAnimationItem {
  constructor(type, position, fromValue, toValue, duration = 1000) {
    this.type = type; // 'hour' | 'minute' | 'second'
    this.position = position; // { x, y, width, height }
    this.fromValue = fromValue;
    this.toValue = toValue;
    this.duration = duration;
    this.elapsed = 0;
    this.completed = false;
  }

  /**
   * 更新动画进度
   */
  update(deltaTime) {
    this.elapsed += deltaTime;
    
    if (this.elapsed >= this.duration) {
      this.elapsed = this.duration;
      this.completed = true;
    }
  }

  /**
   * 获取当前进度（0-1）
   */
  getProgress() {
    return this.elapsed / this.duration;
  }

  /**
   * 获取缓动后的进度
   */
  getEasedProgress() {
    return easeOutCubic(this.getProgress());
  }

  /**
   * 获取当前翻转角度（0-180）
   */
  getAngle() {
    return this.getEasedProgress() * 180;
  }

  /**
   * 是否完成
   */
  isCompleted() {
    return this.completed;
  }
}

/**
 * 翻页动画管理器
 */
export class FlipAnimation {
  constructor(renderer) {
    this.renderer = renderer;
    this.animations = []; // 当前正在执行的动画列表
  }

  /**
   * 开始翻页动画
   * @param {string} type - 动画类型：'hour' | 'minute' | 'second'
   * @param {object} position - 位置信息 { x, y, width, height }
   * @param {number} fromValue - 当前值
   * @param {number} toValue - 目标值
   */
  startFlip(type, position, fromValue, toValue) {
    // 检查是否已有相同类型的动画在执行
    const existingIndex = this.animations.findIndex(anim => anim.type === type);
    if (existingIndex !== -1) {
      // 移除旧动画
      this.animations.splice(existingIndex, 1);
    }

    // 创建新动画
    const animation = new FlipAnimationItem(type, position, fromValue, toValue);
    this.animations.push(animation);
  }

  /**
   * 更新所有动画
   */
  update(deltaTime) {
    // 更新所有动画的进度
    this.animations.forEach(anim => {
      anim.update(deltaTime);
    });

    // 移除已完成的动画
    this.animations = this.animations.filter(anim => !anim.isCompleted());
  }

  /**
   * 渲染所有动画
   * @param {object} currentTime - 当前时间 { hour, minute, second }
   */
  render(currentTime) {
    this.animations.forEach(anim => {
      this.renderAnimation(anim, currentTime);
    });
  }

  /**
   * 渲染单个动画
   */
  renderAnimation(anim, currentTime) {
    const { position, fromValue, toValue, type } = anim;
    const { x, y, width, height } = position;
    const angle = anim.getAngle();
    const progress = anim.getProgress();

    // 先绘制底层（目标值）
    this.renderer.drawNumber(toValue, x, y, width, height);

    // 绘制翻页动画
    if (progress < 0.5) {
      // 前半段：上半部分向下翻转（显示当前值）
      const upperAngle = angle;
      
      // 绘制静态下半部分（当前值）
      this.renderer.drawLowerHalf(fromValue, x, y, width, height);
      
      // 绘制翻转的上半部分（当前值）
      this.renderer.drawFlipFrame(fromValue, x, y, width, height, upperAngle, true);
      
    } else {
      // 后半段：下半部分向上翻转（显示目标值）
      const lowerAngle = angle;
      
      // 绘制静态上半部分（目标值）
      this.renderer.drawUpperHalf(toValue, x, y, width, height);
      
      // 绘制翻转的下半部分（目标值）
      this.renderer.drawFlipFrame(toValue, x, y, width, height, 180 - lowerAngle, false);
    }
  }

  /**
   * 是否有动画正在执行
   */
  hasActiveAnimations() {
    return this.animations.length > 0;
  }

  /**
   * 获取正在动画的类型列表
   */
  getAnimatingTypes() {
    return this.animations.map(anim => anim.type);
  }

  /**
   * 清除所有动画
   */
  clearAll() {
    this.animations = [];
  }
}

export default FlipAnimation;
