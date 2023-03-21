export interface AppState {
  openDraw: boolean;
  title: string;
}

export interface MyRouterType {
  path: string;
  title: string;
}

export interface AnimeInfo {
  officialName: string;
  chineseName?: string;
  author?: string[];
  studio?: string[];
  date?: Date[];
  category?: string[];
  episode?: number;
  wikiUrl?: string;
  imgUrl?: string;
  outline?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SearchParam {
  name?: string;
}

export interface Result<T> {
  type: "S" | "F";
  message?: string;
  data: T;
}
