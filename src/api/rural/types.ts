export interface RuralRegion {
  code: string;
  name: string;
  level: number;
  parentCode?: string;
  hasChildren?: boolean;
}

export interface GetChildrenParams {
  parentCode?: string;
}

export interface DefaultSelectionRes {
  label: string;
  value: string;
  children?: DefaultSelectionRes[];
  hasChildren?: boolean;
}