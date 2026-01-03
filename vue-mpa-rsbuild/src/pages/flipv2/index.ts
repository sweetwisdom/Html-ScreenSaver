// 创建样式
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #000000;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }

  #clockCanvas {
    display: block;
    margin: 0 auto;
  }
`;
document.head.appendChild(style);

// 创建 canvas 元素
const canvas = document.createElement('canvas');
canvas.id = 'clockCanvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Failed to get 2d context');
}
// TypeScript 非空断言，因为上面已经检查过了
const ctxNonNull = ctx;

// 设置canvas尺寸
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 配置参数
const config = {
  cardWidth: 240,
  cardHeight: 280,
  cardSpacing: 40,
  borderRadius: 12,
  cardColor: '#1a1a1a',
  textColor: '#ffffff',
  dividerColor: '#333333',
  fontSize: 160,
  fontFamily: 'Arial, sans-serif'
};

// 当前时间值（两位数字字符串）
const currentTime = {
  hour: '00',
  minute: '00',
  second: '00'
};

// 翻页动画状态
const flipAnimations = {
  hour: { progress: 0, newValue: '00', isAnimating: false },
  minute: { progress: 0, newValue: '00', isAnimating: false },
  second: { progress: 0, newValue: '00', isAnimating: false }
};

// 补零函数
function padZero(num: number): string {
  const str = num.toString();
  if (str.length < 2) {
    return '0' + str;
  }
  return str;
}

// 绘制圆角矩形
function drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
  ctxNonNull.beginPath();
  ctxNonNull.moveTo(x + radius, y);
  ctxNonNull.lineTo(x + width - radius, y);
  ctxNonNull.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctxNonNull.lineTo(x + width, y + height - radius);
  ctxNonNull.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctxNonNull.lineTo(x + radius, y + height);
  ctxNonNull.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctxNonNull.lineTo(x, y + radius);
  ctxNonNull.quadraticCurveTo(x, y, x + radius, y);
  ctxNonNull.closePath();
}

// 绘制两位数字卡片
function drawCard(x: number, y: number, value: string, flipAnim: any) {
  const centerX = x + config.cardWidth / 2;
  const centerY = y + config.cardHeight / 2;
  const halfHeight = config.cardHeight / 2;

  // 绘制卡片背景
  ctxNonNull.fillStyle = config.cardColor;
  drawRoundedRect(x, y, config.cardWidth, config.cardHeight, config.borderRadius);
  ctxNonNull.fill();

  // 绘制中间分割线
  ctxNonNull.strokeStyle = config.dividerColor;
  ctxNonNull.lineWidth = 2;
  ctxNonNull.beginPath();
  ctxNonNull.moveTo(x + 10, centerY);
  ctxNonNull.lineTo(x + config.cardWidth - 10, centerY);
  ctxNonNull.stroke();

  // 设置字体
  ctxNonNull.fillStyle = config.textColor;
  ctxNonNull.font = 'bold ' + config.fontSize + 'px ' + config.fontFamily;
  ctxNonNull.textAlign = 'center';
  ctxNonNull.textBaseline = 'middle';

  // 如果有翻页动画
  if (flipAnim && flipAnim.isAnimating) {
    const progress = flipAnim.progress;
    // 使用缓动函数使动画更自然（ease-in-out）
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = easedProgress * Math.PI;
    const scaleY = Math.cos(angle);
    const offsetY = Math.sin(angle) * halfHeight * 0.3;

    // 绘制上半部分（当前值）- 正在向下翻页
    ctxNonNull.save();
    ctxNonNull.beginPath();
    ctxNonNull.rect(x, y, config.cardWidth, halfHeight);
    ctxNonNull.clip();

    ctxNonNull.translate(centerX, centerY);
    ctxNonNull.scale(1, Math.max(0, scaleY));
    ctxNonNull.translate(-centerX, -centerY - offsetY);

    ctxNonNull.globalAlpha = Math.max(0.2, scaleY);
    ctxNonNull.fillText(value, centerX, centerY);
    ctxNonNull.restore();

    // 绘制下半部分（新值）- 正在向上翻页
    ctxNonNull.save();
    ctxNonNull.beginPath();
    ctxNonNull.rect(x, centerY, config.cardWidth, halfHeight);
    ctxNonNull.clip();

    ctxNonNull.translate(centerX, centerY);
    ctxNonNull.scale(1, Math.max(0, -scaleY));
    ctxNonNull.translate(-centerX, -centerY + offsetY);

    ctxNonNull.globalAlpha = Math.max(0.2, -scaleY);
    ctxNonNull.fillText(flipAnim.newValue, centerX, centerY);
    ctxNonNull.restore();

    // 绘制翻页时的阴影效果
    if (progress > 0.3 && progress < 0.7) {
      ctxNonNull.save();
      const shadowIntensity = Math.sin(progress * Math.PI);
      ctxNonNull.globalAlpha = shadowIntensity * 0.5;
      ctxNonNull.fillStyle = '#000000';
      const shadowHeight = (1 - Math.abs(progress - 0.5) * 2) * 8;
      ctxNonNull.fillRect(x, centerY - shadowHeight / 2, config.cardWidth, shadowHeight);
      ctxNonNull.restore();
    }

    ctxNonNull.globalAlpha = 1;
  } else {
    // 正常显示 - 上半部分
    ctxNonNull.save();
    ctxNonNull.beginPath();
    ctxNonNull.rect(x, y, config.cardWidth, halfHeight);
    ctxNonNull.clip();
    ctxNonNull.fillText(value, centerX, centerY);
    ctxNonNull.restore();

    // 正常显示 - 下半部分
    ctxNonNull.save();
    ctxNonNull.beginPath();
    ctxNonNull.rect(x, centerY, config.cardWidth, halfHeight);
    ctxNonNull.clip();
    ctxNonNull.fillText(value, centerX, centerY);
    ctxNonNull.restore();
  }
}

// 更新动画
function updateAnimations() {
  let animating = false;
  for (const key in flipAnimations) {
    if (flipAnimations.hasOwnProperty(key)) {
      const anim = flipAnimations[key as keyof typeof flipAnimations];
      if (anim.isAnimating) {
        anim.progress += 0.1;
        if (anim.progress >= 1) {
          anim.progress = 0;
          anim.isAnimating = false;
          currentTime[key as keyof typeof currentTime] = anim.newValue;
        } else {
          animating = true;
        }
      }
    }
  }
  return animating;
}

// 检查并触发翻页动画
function checkAndFlip(key: keyof typeof flipAnimations, newValue: string) {
  if (currentTime[key] !== newValue) {
    const anim = flipAnimations[key];
    if (!anim.isAnimating) {
      anim.newValue = newValue;
      anim.progress = 0;
      anim.isAnimating = true;
    }
  }
}

// 初始化时间值
function initTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  currentTime.hour = padZero(hours);
  currentTime.minute = padZero(minutes);
  currentTime.second = padZero(seconds);
}

// 更新时钟
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourStr = padZero(hours);
  const minuteStr = padZero(minutes);
  const secondStr = padZero(seconds);

  checkAndFlip('hour', hourStr);
  checkAndFlip('minute', minuteStr);
  checkAndFlip('second', secondStr);
}

// 绘制日期
function drawDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const dateText = year + '年' + month + '月' + date + '日';

  ctxNonNull.fillStyle = '#ffffff';
  ctxNonNull.font = '36px ' + config.fontFamily;
  ctxNonNull.textAlign = 'center';
  ctxNonNull.textBaseline = 'top';

  const dateY = 60;
  ctxNonNull.fillText(dateText, canvas.width / 2, dateY);
}

// 绘制时钟
function drawClock() {
  // 清空画布
  ctxNonNull.fillStyle = '#000000';
  ctxNonNull.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制日期
  drawDate();

  // 计算起始位置（居中，考虑日期占用的空间）
  const totalWidth = config.cardWidth * 3 + config.cardSpacing * 2;
  const startX = (canvas.width - totalWidth) / 2;
  const dateHeight = 100;
  const startY = (canvas.height - config.cardHeight) / 2 + dateHeight / 2;

  let x = startX;

  // 绘制小时
  const hourAnim = flipAnimations.hour.isAnimating ? flipAnimations.hour : null;
  drawCard(x, startY, currentTime.hour, hourAnim);
  x += config.cardWidth + config.cardSpacing;

  // 绘制分钟
  const minuteAnim = flipAnimations.minute.isAnimating ? flipAnimations.minute : null;
  drawCard(x, startY, currentTime.minute, minuteAnim);
  x += config.cardWidth + config.cardSpacing;

  // 绘制秒
  const secondAnim = flipAnimations.second.isAnimating ? flipAnimations.second : null;
  drawCard(x, startY, currentTime.second, secondAnim);
}

// 动画循环
function animate() {
  updateAnimations();
  updateClock();
  drawClock();

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(animate);
  } else {
    setTimeout(animate, 16);
  }
}

// 初始化
initTime();
updateClock();
drawClock();

// 启动动画循环
animate();

// 每秒更新一次时间
setInterval(updateClock, 1000);

// 防止右键菜单
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
}, false);

// 防止选择文本
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
  return false;
}, false);

