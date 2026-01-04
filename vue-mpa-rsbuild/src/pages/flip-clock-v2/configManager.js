/**
 * 配置管理器
 * 负责从 URL 读取和保存配置
 */
export class ConfigManager {
  constructor() {
    this.config = this.loadFromURL();
  }

  /**
   * 从 URL 参数加载配置
   */
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    return {
      format: parseInt(params.get('format')) || 24,
      showSeconds: params.get('showSeconds') === 'true',
      showDate: params.get('showDate') === 'true',
      showAmPm: params.get('showAmPm') !== 'false',
    };
  }

  /**
   * 保存配置到 URL
   */
  saveToURL(config) {
    const params = new URLSearchParams();
    params.set('format', config.format);
    params.set('showSeconds', config.showSeconds);
    params.set('showDate', config.showDate);
    params.set('showAmPm', config.showAmPm);
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }

  /**
   * 获取配置项
   */
  get(key) {
    return this.config[key];
  }

  /**
   * 更新配置项
   */
  update(key, value) {
    this.config[key] = value;
    this.saveToURL(this.config);
  }

  /**
   * 批量更新配置
   */
  updateAll(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveToURL(this.config);
  }

  /**
   * 获取所有配置
   */
  getAll() {
    return { ...this.config };
  }
}

export default ConfigManager;
