import {
  AnimeInfo,
  AnimeTag,
  DeleteParam,
  Result,
  SearchParam,
  VideoTagRequest,
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
    allTags: build.query<Result<AnimeTag[]>, void>({
      query: () => "/anime-info/allTags",
    }),
    updateTag: build.mutation<Result<boolean>, AnimeTag>({
      query: (req) => ({
        url: "/anime-info/updateTag",
        method: "POST",
        body: req,
      }),
    }),
    deleteTag: build.mutation<Result<boolean>, string>({
      query: (tag) => ({
        url: `/anime-info/deleteTag?id=${tag}`,
        method: "DELETE",
      }),
    }),
    allVideoTags: build.query<Result<{ [key: string]: string[] }>, void>({
      query: () => "/anime-info/allVideoTags",
    }),
    updateVideoTag: build.mutation<Result<boolean>, VideoTagRequest>({
      query: (req) => ({
        url: `/anime-info/updateVideoTag`,
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
  useAllTagsQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useAllVideoTagsQuery,
  useUpdateVideoTagMutation,
} = animeInfoApi;
