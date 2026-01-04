/**
 * Canvas 渲染引擎
 * 负责绘制数字、翻页效果、分隔线等
 */
export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    
    // 颜色配置
    this.colors = {
      background: '#000000',
      digit: '#CCCCCC',
      divider: '#333333',
      ampm: '#666666',
      shadow: 'rgba(0, 0, 0, 0.5)',
    };
    
    // 预渲染数字缓存
    this.digitCache = null;
  }

  /**
   * 设置 Canvas 分辨率（支持高清屏）
   */
  setResolution(width, height) {
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 计算合适的字体大小（确保文字不超出卡片）
   */
  calculateFontSize(width, height, text) {
    const ctx = this.ctx;
    // 初始字体大小基于高度
    let fontSize = height * 0.9;
    
    // 测量文字宽度，确保不超过卡片宽度的80%
    const maxWidth = width * 0.9;
    let textWidth = 0;
    
    // 二分查找合适的字体大小
    let minSize = 10;
    let maxSize = height * 0.95;
    
    while (maxSize - minSize > 1) {
      fontSize = (minSize + maxSize) / 2;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      const metrics = ctx.measureText(text);
      textWidth = metrics.width;
      
      if (textWidth > maxWidth) {
        maxSize = fontSize;
      } else {
        minSize = fontSize;
      }
    }
    
    return Math.floor(fontSize);
  }

  /**
   * 绘制完整数字
   */
  drawNumber(number, x, y, width, height) {
    const ctx = this.ctx;
    
    ctx.save();
    
    // 绘制背景卡片
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, width, height);
    
    // 计算合适的字体大小
    const text = String(number).padStart(2, '0');
    const fontSize = this.calculateFontSize(width, height, text);
    
    // 绘制数字
    ctx.fillStyle = this.colors.digit;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
    
    // 绘制中间分隔线
    this.drawDivider(x, y + height / 2, width);
    
    ctx.restore();
  }

  /**
   * 绘制数字上半部分
   */
  drawUpperHalf(number, x, y, width, height) {
    const ctx = this.ctx;
    
    ctx.save();
    
    // 裁剪上半部分
    ctx.beginPath();
    ctx.rect(x, y, width, height / 2);
    ctx.clip();
    
    // 绘制背景
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, width, height / 2);
    
    // 计算合适的字体大小（使用完整高度来计算，因为文字是完整的）
    const text = String(number).padStart(2, '0');
    const fontSize = this.calculateFontSize(width, height, text);
    
    // 绘制数字
    ctx.fillStyle = this.colors.digit;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
    
    ctx.restore();
    
    // 绘制分隔线
    this.drawDivider(x, y + height / 2, width);
  }

  /**
   * 绘制数字下半部分
   */
  drawLowerHalf(number, x, y, width, height) {
    const ctx = this.ctx;
    
    ctx.save();
    
    // 裁剪下半部分
    ctx.beginPath();
    ctx.rect(x, y + height / 2, width, height / 2);
    ctx.clip();
    
    // 绘制背景
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y + height / 2, width, height / 2);
    
    // 计算合适的字体大小（使用完整高度来计算，因为文字是完整的）
    const text = String(number).padStart(2, '0');
    const fontSize = this.calculateFontSize(width, height, text);
    
    // 绘制数字
    ctx.fillStyle = this.colors.digit;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
    
    ctx.restore();
    
    // 绘制分隔线
    this.drawDivider(x, y + height / 2, width);
  }

  /**
   * 绘制翻页动画帧（带 3D 效果）
   * @param {number} number - 数字
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {number} angle - 翻转角度（0-180）
   * @param {boolean} isUpper - 是否是上半部分
   */
  drawFlipFrame(number, x, y, width, height, angle, isUpper) {
    const ctx = this.ctx;
    
    // 计算 3D 缩放（模拟透视）
    const radians = (angle * Math.PI) / 180;
    const scale = Math.abs(Math.cos(radians));
    
    // 计算阴影强度
    const shadowIntensity = Math.abs(Math.sin(radians)) * 0.6;
    
    ctx.save();
    
    if (isUpper) {
      // 上半部分向下翻转
      const centerY = y + height / 2;
      
      // 移动到翻转中心
      ctx.translate(0, centerY);
      
      // 应用 Y 轴缩放（模拟 3D 翻转）
      ctx.scale(1, scale);
      
      // 移回原位
      ctx.translate(0, -centerY);
      
      // 绘制上半部分
      this.drawUpperHalf(number, x, y, width, height);
      
      // 添加阴影覆盖层
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
      ctx.fillRect(x, y, width, height / 2);
      
    } else {
      // 下半部分向上翻转
      const centerY = y + height / 2;
      
      // 移动到翻转中心
      ctx.translate(0, centerY);
      
      // 应用 Y 轴缩放（模拟 3D 翻转）
      ctx.scale(1, scale);
      
      // 移回原位
      ctx.translate(0, -centerY);
      
      // 绘制下半部分
      this.drawLowerHalf(number, x, y, width, height);
      
      // 添加阴影覆盖层
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
      ctx.fillRect(x, y + height / 2, width, height / 2);
    }
    
    ctx.restore();
  }

  /**
   * 绘制分隔线
   */
  drawDivider(x, y, width) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.strokeStyle = this.colors.divider;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 绘制冒号分隔符
   */
  drawColon(x, y, size) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.fillStyle = this.colors.digit;
    
    // 上圆点
    ctx.beginPath();
    ctx.arc(x, y - size, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 下圆点
    ctx.beginPath();
    ctx.arc(x, y + size, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * 绘制 AM/PM 标识
   */
  drawAmPm(text, x, y) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.fillStyle = this.colors.ampm;
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * 绘制日期
   */
  drawDate(text, x, y) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.fillStyle = this.colors.ampm;
    ctx.font = '24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}

export default CanvasRenderer;
