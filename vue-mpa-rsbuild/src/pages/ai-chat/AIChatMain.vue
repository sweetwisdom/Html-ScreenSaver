<template>
  <div class="box">
    <div class="ai-chat-main">
      <!-- Logo和标语 -->
      <div class="header">
        <div class="logo-container" @click="handleLogoClick">
          <svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10 C30 10, 20 30, 20 50 C20 70, 30 90, 50 90 C70 90, 80 70, 80 50 C80 30, 70 10, 50 10 Z"
              fill="url(#gradient1)"
            />
            <path
              d="M50 30 C40 30, 35 40, 35 50 C35 60, 40 70, 50 70 C60 70, 65 60, 65 50 C65 40, 60 30, 50 30 Z"
              fill="url(#gradient2)"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #4caf50; stop-opacity: 1" />
                <stop offset="33%" style="stop-color: #ffeb3b; stop-opacity: 1" />
                <stop offset="66%" style="stop-color: #ff9800; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #f44336; stop-opacity: 1" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #81c784; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #ffb74d; stop-opacity: 1" />
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">盘古Doer</span>
        </div>
        <p class="tagline">懂您所需,华为云AI助手时刻相伴</p>
      </div>

      <!-- 信息卡片区域 -->
      <div style="flex: 1">
        <div class="cards-container">
          <!-- 产品介绍 -->
          <div class="info-card">
            <div class="card-header">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h3 class="card-title">产品介绍</h3>
            </div>
            <ul class="card-content">
              <li>CCE-云硬盘存储卷</li>
              <li>DWS特殊限制</li>
              <li>DEW-最佳实践DDS数据库加密</li>
            </ul>
          </div>

          <!-- 购买咨询 -->
          <div class="info-card">
            <div class="card-header">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 11H19L20 21H4L5 11Z"
                  stroke="#2196F3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h3 class="card-title">购买咨询</h3>
            </div>
            <ul class="card-content">
              <li>ELB是如何计费的?</li>
              <li>变更CodeArts规格</li>
              <li>隐私保护通话计费是双向还是单向?</li>
            </ul>
          </div>

          <!-- 使用咨询 -->
          <div class="info-card">
            <div class="card-header">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#00BCD4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h3 class="card-title">使用咨询</h3>
            </div>
            <ul class="card-content">
              <li>DEW-密钥管理分配至企业项目</li>
              <li>企业门户-小程序的30套模板在哪里?</li>
              <li>mpc-配置转码服务端事件通知API?</li>
            </ul>
          </div>

          <!-- 故障处理 -->
          <div class="info-card">
            <div class="card-header">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#FF9800"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h3 class="card-title">故障处理</h3>
            </div>
            <ul class="card-content">
              <li>GAUSS-02295: "type of parameter %d (%s) does not..."</li>
              <li>imagesearch-错误码IS.2109</li>
              <li>ALM-24006 Flume Server堆内存使用率超过阈值</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <button class="deep-thinking-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.663 17H4.662C3.742 17 3 16.258 3 15.338V4.662C3 3.742 3.742 3 4.662 3H19.338C20.258 3 21 3.742 21 4.662V9.663M12 12H12.01M16 12H16.01M20 12H20.01M12 16H12.01M16 16H16.01M20 16H20.01M12 20H12.01M16 20H16.01M20 20H20.01"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>深度思考·自动</span>
        </button>
        <input
          type="text"
          class="chat-input"
          placeholder="请您描述问题或输入@选择技能"
          :value="inputText"
          @input="handleInput"
        />
        <span class="char-count">{{ charCount }}/2000</span>
      </div>

      <!-- 底部声明 -->
      <div class="footer">
        <p>内容由AI生成,仅供参考服务声明</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from './store'

export default Vue.extend({
  name: 'AIChatMain',
  inject: {
    isDesktop: {
      default: () => () => false,
    },
    openModal: {
      default: () => () => {},
    },
  },
  data() {
    return {
      charCount: 0,
    }
  },
  computed: {
    inputText() {
      return store.getState().inputText
    },
  },
  mounted() {
    // 监听 store 中的输入文本变化
    this.$watch(
      () => store.getState().inputText,
      newVal => {
        this.charCount = newVal.length
      },
      { immediate: true }
    )
  },
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement
      store.setInputText(target.value)
    },
    handleLogoClick() {
      // 使用 inject 获取父组件的方法
      const isDesktop = (this as any).isDesktop()
      if (!isDesktop) {
        ;(this as any).openModal()
      }
    },
  },
})
</script>

<style scoped>
.box {
  height: 100%;
  /* background: #fff; */
  color: #333;
  border-radius: 20px;
}

.ai-chat-main {
  /* padding: 40px 20px; */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo-container:hover {
  opacity: 0.8;
}

@media (min-width: 1001px) {
  .logo-container {
    cursor: default;
  }

  .logo-container:hover {
    opacity: 1;
  }
}

.logo-icon {
  width: 48px;
  height: 48px;
}

.logo-text {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.tagline {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.info-card {
  /* background: #f5f5f5; */
  border-radius: 12px;
  padding: 20px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-content {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-content li {
  font-size: 14px;
  color: #666;
  padding: 8px 0;
  /* border-bottom: 1px solid #e0e0e0; */
}

.card-content li:last-child {
  border-bottom: none;
}

.input-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.deep-thinking-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: background 0.2s;
}

.deep-thinking-btn:hover {
  background: #e0e0e0;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background: #f9f9f9;
}

.chat-input::placeholder {
  color: #999;
}

.char-count {
  font-size: 14px;
  color: #999;
  min-width: 60px;
  text-align: right;
}

.footer {
  text-align: center;
  /* margin-top: auto; */
  padding-top: 10px;
}

.footer p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }

  .logo-text {
    font-size: 24px;
  }

  .input-section {
    flex-wrap: wrap;
  }
}
</style>
