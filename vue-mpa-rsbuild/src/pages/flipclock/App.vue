<template>
  <div class="lock-screen">
    <canvas ref="canvas" id="clockCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  mounted() {
    this.initClock();
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
  },
  methods: {
    initClock() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 设置canvas尺寸
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
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
      const padZero = (num: number) => {
        const str = num.toString();
        if (str.length < 2) {
          return '0' + str;
        }
        return str;
      };

      // 绘制圆角矩形
      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // 绘制两位数字卡片
      const drawCard = (x: number, y: number, value: string, flipAnim: any) => {
        const centerX = x + config.cardWidth / 2;
        const centerY = y + config.cardHeight / 2;
        const halfHeight = config.cardHeight / 2;

        // 绘制卡片背景
        ctx.fillStyle = config.cardColor;
        drawRoundedRect(x, y, config.cardWidth, config.cardHeight, config.borderRadius);
        ctx.fill();

        // 绘制中间分割线
        ctx.strokeStyle = config.dividerColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 10, centerY);
        ctx.lineTo(x + config.cardWidth - 10, centerY);
        ctx.stroke();

        // 设置字体
        ctx.fillStyle = config.textColor;
        ctx.font = 'bold ' + config.fontSize + 'px ' + config.fontFamily;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

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
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, config.cardWidth, halfHeight);
          ctx.clip();

          ctx.translate(centerX, centerY);
          ctx.scale(1, Math.max(0, scaleY));
          ctx.translate(-centerX, -centerY - offsetY);

          ctx.globalAlpha = Math.max(0.2, scaleY);
          ctx.fillText(value, centerX, centerY);
          ctx.restore();

          // 绘制下半部分（新值）- 正在向上翻页
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, centerY, config.cardWidth, halfHeight);
          ctx.clip();

          ctx.translate(centerX, centerY);
          ctx.scale(1, Math.max(0, -scaleY));
          ctx.translate(-centerX, -centerY + offsetY);

          ctx.globalAlpha = Math.max(0.2, -scaleY);
          ctx.fillText(flipAnim.newValue, centerX, centerY);
          ctx.restore();

          // 绘制翻页时的阴影效果
          if (progress > 0.3 && progress < 0.7) {
            ctx.save();
            const shadowIntensity = Math.sin(progress * Math.PI);
            ctx.globalAlpha = shadowIntensity * 0.5;
            ctx.fillStyle = '#000000';
            const shadowHeight = (1 - Math.abs(progress - 0.5) * 2) * 8;
            ctx.fillRect(x, centerY - shadowHeight / 2, config.cardWidth, shadowHeight);
            ctx.restore();
          }

          ctx.globalAlpha = 1;
        } else {
          // 正常显示 - 上半部分
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, config.cardWidth, halfHeight);
          ctx.clip();
          ctx.fillText(value, centerX, centerY);
          ctx.restore();

          // 正常显示 - 下半部分
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, centerY, config.cardWidth, halfHeight);
          ctx.clip();
          ctx.fillText(value, centerX, centerY);
          ctx.restore();
        }
      };

      // 更新动画
      const updateAnimations = () => {
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
      };

      // 检查并触发翻页动画
      const checkAndFlip = (key: keyof typeof flipAnimations, newValue: string) => {
        if (currentTime[key] !== newValue) {
          const anim = flipAnimations[key];
          if (!anim.isAnimating) {
            anim.newValue = newValue;
            anim.progress = 0;
            anim.isAnimating = true;
          }
        }
      };

      // 初始化时间值
      const initTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        currentTime.hour = padZero(hours);
        currentTime.minute = padZero(minutes);
        currentTime.second = padZero(seconds);
      };

      // 更新时钟
      const updateClock = () => {
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
      };

      // 绘制日期
      const drawDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();

        const dateText = year + '年' + month + '月' + date + '日';

        ctx.fillStyle = '#ffffff';
        ctx.font = '36px ' + config.fontFamily;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const dateY = 60;
        ctx.fillText(dateText, canvas.width / 2, dateY);
      };

      // 绘制时钟
      const drawClock = () => {
        // 清空画布
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      };

      // 动画循环
      const animate = () => {
        updateAnimations();
        updateClock();
        drawClock();

        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(animate);
        } else {
          setTimeout(animate, 16);
        }
      };

      // 初始化
      initTime();
      updateClock();
      drawClock();

      // 启动动画循环
      animate();

      // 每秒更新一次时间
      setInterval(updateClock, 1000);
    }
  }
});
</script>

<style scoped>
.lock-screen {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#clockCanvas {
  display: block;
  margin: 0 auto;
}
</style>
