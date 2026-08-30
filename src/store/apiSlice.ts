import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './index';
import { setCredentials, logout } from '../features/auth/authSlice';
import { API_BASE_URL } from '../config';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
    
    if (refreshResult.data) {
      // @ts-ignore
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(setCredentials({ 
        // @ts-ignore
        accessToken: refreshResult.data.access_token,
        user
      }));
      // Retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Role'],
  endpoints: () => ({}),
});
