import Vue from 'vue';

// 创建一个响应式的状态管理
const state = Vue.observable({
  inputText: '',
  charCount: 0,
  modalVisible: false,
});

// 状态管理方法
export const store = {
  // 设置输入文本
  setInputText(text: string) {
    state.inputText = text;
    state.charCount = text.length;
  },

  // 追加输入文本
  appendInputText(text: string) {
    const newText = state.inputText ? `${state.inputText} ${text}` : text;
    state.inputText = newText;
    state.charCount = newText.length;
  },

  // 打开弹框
  openModal() {
    state.modalVisible = true;
  },

  // 关闭弹框
  closeModal() {
    state.modalVisible = false;
  },

  // 获取状态
  getState() {
    return state;
  },
};

// 导出响应式状态，供组件使用
export default store;

