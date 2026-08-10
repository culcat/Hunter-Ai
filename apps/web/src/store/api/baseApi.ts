import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  Resume,
  CreateResumeDto,
  UpdateResumeDto,
  Vacancy,
  VacancyFilterDto,
  AiMatchResult,
  EvaluateMatchDto,
  GenerateCoverLetterResponse,
  GenerateCoverLetterDto,
  JobApplication,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  UserFavorite,
} from '@hunter-ai/types';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('hunter_ai_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Resume', 'Vacancy', 'Application', 'Favorite', 'AiMatch', 'CoverLetter'],
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getMe: builder.query<AuthResponse['user'], void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Resumes Endpoints
    getResumes: builder.query<Resume[], void>({
      query: () => '/resumes',
      providesTags: ['Resume'],
    }),

    getResume: builder.query<Resume, string>({
      query: (id) => `/resumes/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Resume', id }],
    }),

    createResume: builder.mutation<Resume, CreateResumeDto>({
      query: (body) => ({
        url: '/resumes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resume'],
    }),

    uploadResumePdf: builder.mutation<Resume, FormData>({
      query: (formData) => ({
        url: '/resumes/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Resume'],
    }),

    updateResume: builder.mutation<Resume, { id: string; data: UpdateResumeDto }>({
      query: ({ id, data }) => ({
        url: `/resumes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => ['Resume', { type: 'Resume', id }],
    }),

    deleteResume: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),

    // Vacancies Endpoints
    getVacancies: builder.query<{ items: Vacancy[]; total: number; page: number; limit: number }, VacancyFilterDto>({
      query: (params) => ({
        url: '/vacancies',
        params,
      }),
      providesTags: ['Vacancy'],
    }),

    getVacancy: builder.query<Vacancy, string>({
      query: (id) => `/vacancies/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Vacancy', id }],
    }),

    parseVacancies: builder.mutation<Vacancy[], { target: string; source?: string }>({
      query: (body) => ({
        url: '/vacancies/parse',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vacancy'],
    }),

    // AI Match Endpoints
    evaluateMatch: builder.mutation<AiMatchResult, EvaluateMatchDto>({
      query: (body) => ({
        url: '/ai-match/evaluate',
        method: 'POST',
        body,
      }),
    }),

    // Cover Letters Endpoints
    generateCoverLetter: builder.mutation<GenerateCoverLetterResponse, GenerateCoverLetterDto>({
      query: (body) => ({
        url: '/cover-letters/generate',
        method: 'POST',
        body,
      }),
    }),

    // Applications & Favorites Endpoints
    getApplications: builder.query<JobApplication[], void>({
      query: () => '/applications',
      providesTags: ['Application'],
    }),

    createApplication: builder.mutation<JobApplication, CreateApplicationDto>({
      query: (body) => ({
        url: '/applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Application'],
    }),

    updateApplicationStatus: builder.mutation<JobApplication, { id: string; data: UpdateApplicationStatusDto }>({
      query: ({ id, data }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    deleteApplication: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),

    getFavorites: builder.query<UserFavorite[], void>({
      query: () => '/favorites',
      providesTags: ['Favorite'],
    }),

    addFavorite: builder.mutation<UserFavorite, string>({
      query: (vacancyId) => ({
        url: `/favorites/${vacancyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorite'],
    }),

    removeFavorite: builder.mutation<{ success: boolean }, string>({
      query: (vacancyId) => ({
        url: `/favorites/${vacancyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetResumesQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useUploadResumePdfMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useGetVacanciesQuery,
  useGetVacancyQuery,
  useParseVacanciesMutation,
  useEvaluateMatchMutation,
  useGenerateCoverLetterMutation,
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = baseApi;
