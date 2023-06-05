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
  watched?: boolean;
}

export interface SearchParam {
  name?: string;
}

export interface Result<T> {
  type: "S" | "F";
  message?: string;
  data: T;
}

export interface WatchParam {
  officialName: string;
  watched: boolean;
}

export interface WatchProgressParam {
  officialName: string;
  value: string;
}

export interface DeleteParam {
  officialName: string;
}

export interface AnimeTag {
  id: string;
  desc: string;
}

export interface VideoTagRequest {
  officialName: string;
  idList: string[];
}
