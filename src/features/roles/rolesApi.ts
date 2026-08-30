import { apiSlice } from '../../store/apiSlice';
import { RolePublic, RoleCreate, RoleUpdate } from '../../types/role';
import { StandardResponse } from '../../types/api';

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<StandardResponse<RolePublic[]>, { skip?: number; limit?: number } | void>({
      query: (args) => {
        const skip = args?.skip ?? 0;
        const limit = args?.limit ?? 100;
        return `/roles/?skip=${skip}&limit=${limit}`;
      },
      providesTags: (result) => 
        result?.data 
          ? [
              'Role',
              ...result.data.map(({ id }) => ({ type: 'Role' as const, id })),
            ]
          : ['Role'],
    }),
    createRole: builder.mutation<StandardResponse<RolePublic>, RoleCreate>({
      query: (role) => ({
        url: '/roles/',
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<StandardResponse<RolePublic>, { id: string } & RoleUpdate>({
      query: ({ id, ...patch }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    assignRole: builder.mutation<{ detail: string }, { roleId: string; userId: string }>({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/assign/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }
      ],
    }),
    revokeRole: builder.mutation<{ detail: string }, { roleId: string; userId: string }>({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/revoke/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} = rolesApi;
