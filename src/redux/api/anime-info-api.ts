import {
  AnimeInfo,
  DeleteParam,
  Result,
  SearchParam,
  WatchParam,
  WatchProgressParam,
} from "utils/typings";
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
    watchProgress: build.mutation<Result<boolean>, WatchProgressParam>({
      query: (req) => ({
        url: "/anime-info/watchProgress",
        method: "POST",
        body: req,
      }),
    }),
    allWatchProgress: build.query<
      Result<{
        [key: string]: string;
      }>,
      void
    >({
      query: () => "/anime-info/allWatchProgress",
    }),
    message: build.mutation<Result<boolean>, WatchProgressParam>({
      query: (req) => ({
        url: "/anime-info/message",
        method: "POST",
        body: req,
      }),
    }),
    allMessage: build.query<
      Result<{
        [key: string]: string;
      }>,
      void
    >({
      query: () => "/anime-info/allMessage",
    }),
    deleteAnime: build.mutation<Result<boolean>, DeleteParam>({
      query: (req) => ({
        url: "/anime-info/deleteAnime",
        method: "POST",
        body: req,
      }),
    }),
  }),
});

export const {
  useUpdateAnimeInfoMutation,
  useSearchAnimeInfoMutation,
  useAnimeListQuery,
  useWatchedMutation,
  useAllWatchedQuery,
  useDeleteAnimeMutation,
  useAllWatchProgressQuery,
  useWatchProgressMutation,
  useAllMessageQuery,
  useMessageMutation,
} = animeInfoApi;
