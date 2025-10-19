import { defineStore } from 'pinia';

export interface RuralSelectionState {
  // 完整路径（省/市/县/乡/村/屯等）
  path: Array<string | number>;
  // 末级编码
  leafCode: string | number | null;
  // 末级名称（展示用）
  label: string;
}

const DEFAULT_LABEL = '乌翁屯';

const useRuralStore = defineStore('rural', {
  state: (): RuralSelectionState => ({
    path: [],
    leafCode: null,
    label: DEFAULT_LABEL,
  }),
  getters: {
    selection(state): RuralSelectionState {
      return { ...state };
    },
  },
  actions: {
    setSelection(payload: Partial<RuralSelectionState>) {
      if (payload.path) this.path = payload.path;
      if (payload.leafCode !== undefined) this.leafCode = payload.leafCode ?? null;
      if (payload.label) this.label = payload.label;
    },
    reset() {
      this.path = [];
      this.leafCode = null;
      this.label = DEFAULT_LABEL;
    },
  },
  persist: true,
});

export default useRuralStore;