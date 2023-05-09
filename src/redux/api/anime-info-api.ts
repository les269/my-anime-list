import { AnimeInfo, Result, SearchParam } from "../../utils/typings";
import { api } from "./api";

export const animeInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateAnimeInfo: build.mutation<Result<void>, AnimeInfo>({
      query: (req) => ({
        url: "/anime-info/update",
        method: "POST",
        body: req,
      }),
    }),
    searchAnimeInfo: build.mutation<Result<AnimeInfo>, SearchParam>({
      query: (req) => ({
        url: "/anime-info/search",
        method: "POST",
        body: req,
      }),
    }),
    animeList: build.query<Result<AnimeInfo[]>, void>({
      query: () => "/anime-info/list",
    }),
  }),
});

export const {
  useUpdateAnimeInfoMutation,
  useSearchAnimeInfoMutation,
  useAnimeListQuery,
} = animeInfoApi;
