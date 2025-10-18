import type { App } from 'vue';
import { watch } from 'vue';
import { useAppStore } from '@/store';
import type { ThemeMode } from '@/store/modules/app/types';

function isDarkMode(mode: ThemeMode): boolean {
  // #ifdef H5
  if (mode === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  // #endif
  return mode === 'dark';
}

function applyThemeClass(mode: ThemeMode) {
  // 仅在 H5 端切换根元素类名，驱动 .theme-dark 变量覆盖
  // 其他端（如小程序）建议在页面根容器上绑定类名（后续可扩展）
  // #ifdef H5
  const root = document.documentElement;
  const dark = isDarkMode(mode);
  root.classList.toggle('theme-dark', dark);
  root.classList.toggle('theme-light', !dark);
  // #endif
}

export default function setupTheme(app: App) {
  const appStore = useAppStore();

  // 首次应用
  applyThemeClass(appStore.getTheme as ThemeMode);

  // 监听主题变化
  watch(
    () => appStore.getTheme,
    (mode) => {
      applyThemeClass(mode as ThemeMode);
    },
    { immediate: true },
  );

  // 监听系统暗色模式变化（仅 H5 + auto 模式）
  // #ifdef H5
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (media && typeof media.addEventListener === 'function') {
    const handler = () => {
      if (appStore.getTheme === 'auto') {
        applyThemeClass('auto');
      }
    };
    media.addEventListener('change', handler);
  }
  // #endif
}