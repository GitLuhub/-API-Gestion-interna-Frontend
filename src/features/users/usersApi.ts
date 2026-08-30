import { apiSlice } from '../../store/apiSlice';
import { UserPublic, UserCreate, UserUpdate } from '../../types/user';
import { StandardResponse } from '../../types/api';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<StandardResponse<UserPublic[]>, { skip?: number; limit?: number } | void>({
      query: (args) => {
        const skip = args?.skip ?? 0;
        const limit = args?.limit ?? 100;
        return `/users/?skip=${skip}&limit=${limit}`;
      },
      providesTags: (result) => 
        result?.data 
          ? [
              'User',
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
            ]
          : ['User'],
    }),
    createUser: builder.mutation<StandardResponse<UserPublic>, UserCreate>({
      query: (user) => ({
        url: '/users/',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<StandardResponse<UserPublic>, { id: string } & UserUpdate>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
