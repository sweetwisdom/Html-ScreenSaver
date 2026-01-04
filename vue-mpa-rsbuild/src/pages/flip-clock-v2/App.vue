<template>
  <div class="flip-clock" tabindex="0" @keydown="handleKeydown">
    <canvas ref="canvasRef"></canvas>
    
    <!-- 配置面板 -->
    <transition name="fade">
      <div v-if="showConfig" class="config-panel">
        <h3>设置</h3>
        
        <div class="config-group">
          <label class="config-label">时间格式</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model.number="localConfig.format" 
                :value="12" 
              />
              12小时制
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model.number="localConfig.format" 
                :value="24" 
              />
              24小时制
            </label>
          </div>
        </div>
        
        <div class="config-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localConfig.showSeconds" 
            />
            显示秒
          </label>
        </div>
        
        <div class="config-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localConfig.showDate" 
            />
            显示日期
          </label>
        </div>
        
        <div class="config-group" v-if="localConfig.format === 12">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localConfig.showAmPm" 
            />
            显示 AM/PM
          </label>
        </div>
        
        <button class="close-btn" @click="closeConfig">关闭</button>
        
        <div class="tip">按 F1 打开/关闭设置</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed, reactive } from 'vue';
import { CanvasRenderer } from './canvasRenderer.js';
import { FlipAnimation } from './flipAnimation.js';
import { ConfigManager } from './configManager.js';

export default {
  name: 'FlipClock',
  setup() {
    const canvasRef = ref(null);
    const showConfig = ref(false);
    
    const configManager = new ConfigManager();
    const localConfig = reactive(configManager.getAll());
    
    let renderer = null;
    let animator = null;
    let animationFrameId = null;
    let lastTime = Date.now();
    let lastCheckTime = 0;
    
    // 当前时间状态
    const currentTime = reactive({
      hour: 0,
      minute: 0,
      second: 0,
    });
    
    // 当前日期
    const currentDate = computed(() => {
      const now = new Date();
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    });
    
    /**
     * 初始化 Canvas
     */
    const initCanvas = () => {
      const canvas = canvasRef.value;
      renderer = new CanvasRenderer(canvas);
      animator = new FlipAnimation(renderer);
      
      // 设置分辨率
      handleResize();
      
      // 初始化当前时间
      updateCurrentTime();
    };
    
    /**
     * 更新当前时间
     */
    const updateCurrentTime = () => {
      const now = new Date();
      let hour = now.getHours();
      
      // 12小时制转换
      if (localConfig.format === 12) {
        hour = hour % 12 || 12;
      }
      
      currentTime.hour = hour;
      currentTime.minute = now.getMinutes();
      currentTime.second = now.getSeconds();
    };
    
    /**
     * 检查时间变化并触发翻页
     */
    const checkTimeChange = () => {
      const now = new Date();
      let hour = now.getHours();
      
      // 12小时制转换
      if (localConfig.format === 12) {
        hour = hour % 12 || 12;
      }
      
      const minute = now.getMinutes();
      const second = now.getSeconds();
      
      // 检测小时变化
      if (hour !== currentTime.hour) {
        const positions = getDigitPositions();
        animator.startFlip('hour', positions.hour, currentTime.hour, hour);
        currentTime.hour = hour;
      }
      
      // 检测分钟变化
      if (minute !== currentTime.minute) {
        const positions = getDigitPositions();
        animator.startFlip('minute', positions.minute, currentTime.minute, minute);
        currentTime.minute = minute;
      }
      
      // 检测秒变化
      if (localConfig.showSeconds && second !== currentTime.second) {
        const positions = getDigitPositions();
        animator.startFlip('second', positions.second, currentTime.second, second);
        currentTime.second = second;
      }
    };
    
    /**
     * 获取数字位置
     */
    const getDigitPositions = () => {
      const canvas = canvasRef.value;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      // 数字卡片尺寸（增大尺寸）
      const cardWidth = Math.min(width * 0.25, 300);
      const cardHeight = cardWidth * 1.5;
      
      // 间距
      const gap = cardWidth * 0.2;
      const colonWidth = cardWidth * 0.15;
      
      // 计算总宽度
      let totalWidth;
      if (localConfig.showSeconds) {
        // 时:分:秒
        totalWidth = cardWidth * 3 + colonWidth * 2 + gap * 4;
      } else {
        // 时:分
        totalWidth = cardWidth * 2 + colonWidth + gap * 2;
      }
      
      // 起始 X 坐标（居中）
      const startX = (width - totalWidth) / 2;
      const centerY = (height - cardHeight) / 2;
      
      const positions = {
        hour: {
          x: startX,
          y: centerY,
          width: cardWidth,
          height: cardHeight,
        },
        minute: {
          x: startX + cardWidth + gap + colonWidth,
          y: centerY,
          width: cardWidth,
          height: cardHeight,
        },
        colon1: {
          x: startX + cardWidth + gap / 2 + colonWidth / 2,
          y: centerY + cardHeight / 2,
          size: cardWidth * 0.08,
        },
      };
      
      if (localConfig.showSeconds) {
        positions.second = {
          x: startX + cardWidth * 2 + gap * 2 + colonWidth * 2,
          y: centerY,
          width: cardWidth,
          height: cardHeight,
        };
        positions.colon2 = {
          x: startX + cardWidth * 2 + gap * 1.5 + colonWidth * 1.5,
          y: centerY + cardHeight / 2,
          size: cardWidth * 0.08,
        };
      }
      
      return positions;
    };
    
    /**
     * 动画循环
     */
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      
      // 每 100ms 检查一次时间变化
      if (now - lastCheckTime > 100) {
        checkTimeChange();
        lastCheckTime = now;
      }
      
      // 更新动画
      animator.update(deltaTime);
      
      // 渲染当前帧
      render();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    /**
     * 渲染当前帧
     */
    const render = () => {
      renderer.clear();
      
      const positions = getDigitPositions();
      
      // 获取正在动画的类型
      const animatingTypes = animator.getAnimatingTypes();
      
      // 如果有动画正在执行，先渲染静态部分，再渲染动画
      if (animator.hasActiveAnimations()) {
        // 先绘制所有静态数字卡片（不包括正在动画的）
        if (!animatingTypes.includes('hour')) {
          renderer.drawNumber(currentTime.hour, positions.hour.x, positions.hour.y, positions.hour.width, positions.hour.height);
        }
        
        if (!animatingTypes.includes('minute')) {
          renderer.drawNumber(currentTime.minute, positions.minute.x, positions.minute.y, positions.minute.width, positions.minute.height);
        }
        
        if (localConfig.showSeconds && !animatingTypes.includes('second')) {
          renderer.drawNumber(currentTime.second, positions.second.x, positions.second.y, positions.second.width, positions.second.height);
        }
        
        // 然后渲染动画
        animator.render(currentTime);
        
        // 绘制冒号
        renderer.drawColon(positions.colon1.x, positions.colon1.y, positions.colon1.size);
        if (localConfig.showSeconds && positions.colon2) {
          renderer.drawColon(positions.colon2.x, positions.colon2.y, positions.colon2.size);
        }
      } else {
        // 没有动画时，绘制静态数字
        renderer.drawNumber(currentTime.hour, positions.hour.x, positions.hour.y, positions.hour.width, positions.hour.height);
        renderer.drawColon(positions.colon1.x, positions.colon1.y, positions.colon1.size);
        renderer.drawNumber(currentTime.minute, positions.minute.x, positions.minute.y, positions.minute.width, positions.minute.height);
        
        if (localConfig.showSeconds) {
          renderer.drawColon(positions.colon2.x, positions.colon2.y, positions.colon2.size);
          renderer.drawNumber(currentTime.second, positions.second.x, positions.second.y, positions.second.width, positions.second.height);
        }
      }
      
      // 绘制 AM/PM
      if (localConfig.format === 12 && localConfig.showAmPm) {
        const now = new Date();
        const ampm = now.getHours() < 12 ? 'AM' : 'PM';
        renderer.drawAmPm(ampm, 50, 80);
      }
      
      // 绘制日期
      if (localConfig.showDate) {
        const canvas = canvasRef.value;
        const centerX = canvas.clientWidth / 2;
        const bottomY = canvas.clientHeight - 80;
        renderer.drawDate(currentDate.value, centerX, bottomY);
      }
    };
    
    /**
     * 处理键盘事件
     */
    const handleKeydown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        showConfig.value = !showConfig.value;
      } else if (e.key === 'Escape' && showConfig.value) {
        showConfig.value = false;
      }
    };
    
    /**
     * 关闭配置面板
     */
    const closeConfig = () => {
      showConfig.value = false;
    };
    
    /**
     * 监听配置变化
     */
    watch(localConfig, (newConfig) => {
      configManager.updateAll(newConfig);
      updateCurrentTime();
    }, { deep: true });
    
    /**
     * 处理窗口大小变化
     */
    const handleResize = () => {
      if (!canvasRef.value || !renderer) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setResolution(width, height);
    };
    
    onMounted(() => {
      initCanvas();
      animate();
      
      window.addEventListener('resize', handleResize);
      
      // 确保组件可以接收键盘事件
      const el = canvasRef.value.parentElement;
      el.focus();
    });
    
    onUnmounted(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      canvasRef,
      showConfig,
      localConfig,
      currentDate,
      handleKeydown,
      closeConfig,
    };
  },
};
</script>

<style scoped>
.flip-clock {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  outline: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 配置面板 */
.config-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.5);
  min-width: 320px;
  z-index: 1000;
}

.config-panel h3 {
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.config-group {
  margin-bottom: 25px;
}

.config-label {
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s;
}

.radio-label:hover,
.checkbox-label:hover {
  color: #333;
}

.radio-label input,
.checkbox-label input {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.close-btn {
  width: 100%;
  margin-top: 30px;
  padding: 14px 30px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #555;
}

.tip {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
