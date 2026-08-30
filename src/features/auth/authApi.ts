import { apiSlice } from '../../store/apiSlice';
import { LoginRequest, TokenResponse, AuthUser } from '../../types/auth';
import { StandardResponse } from '../../types/api';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query<StandardResponse<AuthUser>, void>({
      query: () => '/users/me',
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
