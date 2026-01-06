<template>
  <div class="service-portal">
    <!-- 自助服务 -->
    <div class="service-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFC107" />
          <path d="M2 17L12 22L22 17" stroke="#FFC107" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#FFC107" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <h2 class="section-title">自助服务</h2>
      </div>
      <div class="service-grid">
        <div class="service-item" v-for="item in selfServiceItems" :key="item.id"
          @click="handleServiceClick(item.label)">
          <svg class="service-icon" :viewBox="item.iconViewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-for="(path, idx) in item.iconPaths" :key="idx" :d="path.d" :fill="path.fill" :stroke="path.stroke"
              :stroke-width="path.strokeWidth" :stroke-linecap="path.strokeLinecap"
              :stroke-linejoin="path.strokeLinejoin" />
          </svg>
          <span class="service-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="service-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#4CAF50" stroke="#4CAF50" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="section-title">快速入口</h2>
      </div>
      <div class="service-grid quick-entry-grid">
        <div class="service-item" v-for="item in quickEntryItems" :key="item.id">
          <svg class="service-icon" :viewBox="item.iconViewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-for="(path, idx) in item.iconPaths" :key="idx" :d="path.d" :fill="path.fill" :stroke="path.stroke"
              :stroke-width="path.strokeWidth" :stroke-linecap="path.strokeLinecap"
              :stroke-linejoin="path.strokeLinejoin" />
          </svg>
          <span class="service-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 服务热线 -->
    <div class="footer-hotline">
      <svg class="phone-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="hotline-text">服务热线: 4000-955-988 950808</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import store from './store';

export default Vue.extend({
  name: 'ServicePortal',
  inject: {
    isDesktop: {
      default: () => () => false,
    },
  },
  data() {
    return {
      selfServiceItems: [
        {
          id: 1,
          label: '申请配额',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M12 2L2 7L12 12L22 7L12 2Z', fill: '#666' },
            { d: 'M2 17L12 22L22 17M2 12L12 17L22 12', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        },
        {
          id: 2,
          label: '查询资源',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M18 10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H18M18 10H6C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14H18M18 10V8C18 6.89543 17.1046 6 16 6H8C6.89543 6 6 6.89543 6 8V10M18 14V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V14', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        },
        {
          id: 3,
          label: '查询账单',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M14 2V8H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M16 13H8', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' },
            { d: 'M16 17H8', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' },
            { d: 'M10 9H9H8', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 4,
          label: '开具发票',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M14 2V8H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M12 18V12M9 15H15', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 5,
          label: '提交工单',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M14 2V8H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M16 13H8M12 17H8', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' },
            { d: 'M15 9L12 12L9 9', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        },
        {
          id: 6,
          label: '更多服务',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        }
      ],
      quickEntryItems: [
        {
          id: 1,
          label: '助手介绍',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M14 2V8H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M12 18C12 16.8954 11.1046 16 10 16C8.89543 16 8 16.8954 8 18', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' },
            { d: 'M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 2,
          label: '新手入门',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M12 15L8 11L12 7M16 11H8', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        },
        {
          id: 3,
          label: '价格说明',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M14 2V8H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M12 18V12M9 15H15', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 4,
          label: '找回密码',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z', stroke: '#666', strokeWidth: '2' },
            { d: 'M11 14C8.23858 14 6 16.2386 6 19V21H16V19C16 16.2386 13.7614 14 11 14Z', stroke: '#666', strokeWidth: '2' },
            { d: 'M19 7L21 9L19 11', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M17 9H22', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 5,
          label: '订单管理',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M4 6H20M4 10H20M4 14H20M4 18H20', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 6,
          label: '伙伴中心',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
          ]
        },
        {
          id: 7,
          label: '开发者中心',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M9.75 17L9 20L12 21L15 20L14.25 17', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M6 2H18C19.1046 2 20 2.89543 20 4V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V4C4 2.89543 4.89543 2 6 2Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M12 6V14M8 10H16', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        },
        {
          id: 8,
          label: '云社区',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z', stroke: '#666', strokeWidth: '2' },
            { d: 'M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z', stroke: '#666', strokeWidth: '2' }
          ]
        },

        {
          id: 10,
          label: '建议反馈',
          iconViewBox: '0 0 24 24',
          iconPaths: [
            { d: 'M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
            { d: 'M8 9H16M8 13H12', stroke: '#666', strokeWidth: '2', strokeLinecap: 'round' }
          ]
        }
      ]
    };
  },
  methods: {
    handleServiceClick(label) {
      // 发送文字到输入框
      store.appendInputText(label);

      console.log(this.isDesktop(), label);
      // 如果是弹框模式，发送后关闭
      const isDesktop = this.isDesktop();
      if (!isDesktop) {
        // 延迟关闭，让用户看到文字已输入
        setTimeout(() => {
          store.closeModal();
        }, 300);
      }
    },
  },
});
</script>

<style scoped>
.service-portal {

  padding: 40px 20px;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  color: #333;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;

}

.service-section {
 
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  
}

.section-icon {
  width: 32px;
  height: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
}

.quick-entry-grid {
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 32px;
  height: 32px;
}

.service-label {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.footer-hotline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;

}

.phone-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.hotline-text {
  font-size: 14px;
  color: #666;
}


</style>
