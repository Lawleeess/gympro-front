export interface ModuleData {
  id: string;
  name: string;
  icon: string;
  redirectPath: string;
}

export interface PaginationEvent {
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
  length: number;
}

export class PaginationParams {
  offset: number;
  limit: number;
}
export class Period {
  startDate: string;
  endDate: string;
}
export class Option {
  label: string;
  value: number | string;
}
export class Tabs {
  selectedIndex: number;
  options: Option[];
}
