import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
});
export const api = createApi({
  reducerPath: "animeApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
