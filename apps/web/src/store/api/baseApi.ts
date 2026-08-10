import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '@hunter-ai/types';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery } = baseApi;
