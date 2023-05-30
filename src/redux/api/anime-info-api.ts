import { AnimeInfo, Result, SearchParam, WatchParam } from "utils/typings";
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
    watched: build.mutation<Result<boolean>, WatchParam>({
      query: (req) => ({
        url: "/anime-info/watched",
        method: "POST",
        body: req,
      }),
    }),
    allWatched: build.query<
      Result<{
        [key: string]: boolean;
      }>,
      void
    >({
      query: () => "/anime-info/allWatched",
    }),
  }),
});

export const {
  useUpdateAnimeInfoMutation,
  useSearchAnimeInfoMutation,
  useAnimeListQuery,
  useWatchedMutation,
  useAllWatchedQuery,
} = animeInfoApi;
