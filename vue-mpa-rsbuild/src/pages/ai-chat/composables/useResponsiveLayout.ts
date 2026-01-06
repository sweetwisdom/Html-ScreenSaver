import Vue from 'vue';

export interface ResponsiveLayoutState {
  isDesktop: boolean;
  contentWidth: number;
}

/**
 * 响应式布局 Hook
 * 监听容器宽度变化，判断是否显示桌面布局
 */
export function useResponsiveLayout(
  containerElement: HTMLElement | null,
  breakpoint: number = 1000
) {
  const state = Vue.observable<ResponsiveLayoutState>({
    isDesktop: false,
    contentWidth: 0,
  });

  let resizeObserver: ResizeObserver | null = null;
  let cleanupFn: (() => void) | null = null;

  const updateLayout = (width: number) => {
    state.contentWidth = width;
    state.isDesktop = width > breakpoint;
  };

  const initObserver = () => {
    if (!containerElement) {
      return () => {};
    }

    if (typeof ResizeObserver === 'undefined') {
      // 降级方案：使用 window resize
      const handleResize = () => {
        if (containerElement) {
          const width = containerElement.clientWidth;
          updateLayout(width);
        }
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // 初始化
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // 使用 ResizeObserver
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        updateLayout(width);
      }
    });

    resizeObserver.observe(containerElement);
    // 初始化
    updateLayout(containerElement.clientWidth);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
  };

  const cleanup = () => {
    if (cleanupFn) {
      cleanupFn();
      cleanupFn = null;
    }
  };

  const init = () => {
    cleanup();
    cleanupFn = initObserver();
  };

  if (containerElement) {
    init();
  }

  return {
    state,
    init,
    cleanup,
  };
}

