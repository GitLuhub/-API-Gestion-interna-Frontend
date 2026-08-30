# 📋 Plan de Mejora — Frontend API Gestión Interna

> **Basado en:** Análisis completo del backend FastAPI (schemas, endpoints, respuesta estándar, RBAC, JWT dual con cookies httpOnly) y del estado actual del frontend React/TypeScript.

---

## Fase 0 — Corrección de Bugs Existentes
> *Prioridad: CRÍTICA — El código actual tiene errores que impiden compilar tests y desalineaciones con el backend.*

- [x] **0.1** Corregir imports en tests (`Login.test.tsx` usa `import Login` default pero el componente exporta `export function Login` → named)
- [x] **0.2** Corregir imports en tests (`UsersList.test.tsx` usa `import UsersList` default pero exporta `export const UsersList`)
- [x] **0.3** Alinear selectores de texto en `Login.test.tsx` con el UI real:
  - Label email: busca `/Email/i` → debería buscar `/correo electrónico/i`
  - Botón: busca `/Entrar/i` → debería buscar `/Iniciar Sesión/i`
  - Loading: busca `/Entrando/i` → debería buscar `/Iniciando sesión/i`
- [x] **0.4** Eliminar `axios` de `package.json` (no se usa; RTK Query usa `fetchBaseQuery`)
- [x] **0.5** Verificar que los tests pasan ejecutando `npx jest --verbose`

---

## Fase 1 — Tipado TypeScript Estricto
> *Alinear los tipos del frontend con los schemas Pydantic del backend para garantizar type safety.*

### Tipos basados en los schemas del backend

- [x] **1.1** Crear `src/types/user.ts` con las interfaces:
  ```typescript
  // Alineado con app/schemas/user.py del backend
  interface UserPublic {
    id: string;          // UUID serializado
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;  // ISO datetime
    updated_at: string;
  }
  interface UserCreate {
    email: string;
    first_name: string;
    last_name: string;
    password: string;     // min 8, max 128
    is_active?: boolean;
    is_superuser?: boolean;
  }
  interface UserUpdate {
    email?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    is_superuser?: boolean;
  }
  ```

- [x] **1.2** Crear `src/types/role.ts`:
  ```typescript
  // Alineado con app/schemas/role.py del backend
  interface RolePublic {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }
  interface RoleCreate {
    name: string;            // min 2, max 50
    description?: string;    // max 255
  }
  interface RoleUpdate {
    name?: string;
    description?: string;
  }
  ```

- [x] **1.3** Crear `src/types/api.ts` con el tipo de respuesta estándar:
  ```typescript
  // Alineado con app/schemas/response.py del backend
  interface PaginationMeta {
    total: number;
    skip: number;
    limit: number;
  }
  interface StandardResponse<T> {
    data: T;
    meta?: PaginationMeta;
    message?: string;
  }
  ```

- [x] **1.4** Crear `src/types/auth.ts`:
  ```typescript
  // Alineado con app/schemas/auth.py del backend
  interface LoginRequest {
    email: string;
    password: string;
  }
  interface TokenResponse {
    access_token: string;
    token_type: string;
  }
  interface AuthUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser: boolean;
    roles: string[];
  }
  ```

- [x] **1.5** Reemplazar todos los `any` en `authSlice.ts` por `AuthUser`
- [x] **1.6** Tipar todos los endpoints de RTK Query con genéricos (`builder.query<ReturnType, ArgType>`)

---

## Fase 2 — Adaptación de la Capa de Datos al Backend Real
> *El backend usa `StandardResponse<T>` con `{ data, meta?, message? }` — el frontend debe alinearse.*

### Autenticación (JWT dual con cookies httpOnly)

- [x] **2.1** Adaptar `apiSlice.ts` → el `baseQuery` debe enviar `credentials: 'include'` en todas las requests para que las cookies httpOnly se envíen automáticamente:
  ```typescript
  fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1',
    credentials: 'include',  // ← CRÍTICO para las cookies del refresh token
    prepareHeaders: (headers, { getState }) => { ... }
  })
  ```

- [x] **2.2** Adaptar `baseQueryWithReauth` → el endpoint de refresh es `/auth/refresh` (POST) y **no necesita enviar el refresh_token en el body** (se envía automáticamente como cookie httpOnly)

- [x] **2.3** Adaptar `authApi.ts` → tipar la mutation `login`:
  - Request: `LoginRequest` (`{ email, password }`)
  - Response: `TokenResponse` (`{ access_token, token_type }`)

- [x] **2.4** Crear endpoint `getMe` en `authApi.ts` → GET `/users/me` para obtener el perfil completo del usuario autenticado después del login

- [x] **2.5** Actualizar `Login.tsx` → después de recibir el `access_token`, llamar a `getMe` para obtener los datos reales del usuario (en lugar del placeholder `{ email }`)

### Usuarios

- [x] **2.6** Adaptar `usersApi.ts`:
  - Tipar `getUsers` → `builder.query<StandardResponse<UserPublic[]>, {skip?: number, limit?: number}>`
  - El `transformResponse` ya extrae `response.data` ✅ pero debe también extraer `response.meta` para paginación
  - Tipar `createUser` → request: `UserCreate`, response: `StandardResponse<UserPublic>`
  - Tipar `updateUser` → soportar tanto PUT (full) como PATCH (parcial) según el backend
  - Tipar `deleteUser` → respuesta es `204 No Content` (sin body)
  - Agregar parámetros de paginación `skip` y `limit` a `getUsers`

### Roles

- [x] **2.7** Adaptar `rolesApi.ts`:
  - Tipar `getRoles` → `builder.query<StandardResponse<RolePublic[]>, {skip?: number, limit?: number}>`
  - Tipar `createRole` → request: `RoleCreate`, response: `StandardResponse<RolePublic>`
  - Agregar endpoint `updateRole` (PUT `/roles/:id`) — falta en el frontend
  - Agregar endpoint `deleteRole` (DELETE `/roles/:id`) — falta en el frontend
  - Tipar `assignRole` y `revokeRole` correctamente

- [x] **2.8** Agregar los handlers MSW faltantes en `mocks/server.ts`:
  - GET `/roles/` con respuesta `StandardResponse`
  - POST `/users/`, PUT `/users/:id`, DELETE `/users/:id`
  - POST `/roles/`, PUT `/roles/:id`, DELETE `/roles/:id`
  - POST `/roles/:id/assign/:userId`, DELETE `/roles/:id/revoke/:userId`
  - GET `/users/me`
  - POST `/auth/refresh`, POST `/auth/logout`
  - Actualizar el mock de login para que la respuesta coincida exactamente con el backend

---

## Fase 3 — Componentes UI (CRUD Completo)
> *Actualmente solo hay listados read-only. Implementar formularios y acciones.*

### Layout y Navegación

- [x] **3.1** Extraer `Dashboard` de `App.tsx` a su propio componente `src/features/dashboard/Dashboard.tsx`
- [x] **3.2** Crear `src/components/common/Layout.tsx` con:
  - Sidebar/navbar de navegación (Usuarios, Roles, Dashboard)
  - Header con nombre del usuario logueado y botón de logout
  - Contenedor principal responsive
- [x] **3.3** Crear `src/components/common/ConfirmDialog.tsx` — diálogo modal de confirmación para acciones destructivas
- [x] **3.4** Crear `src/components/common/Toast.tsx` — notificaciones de feedback (éxito/error)
- [x] **3.5** Crear `src/components/common/Pagination.tsx` — componente de paginación reutilizable alineado con `PaginationMeta`
- [x] **3.6** Crear `src/components/common/LoadingSpinner.tsx`
- [x] **3.7** Crear `src/components/common/ErrorMessage.tsx`

### Módulo de Usuarios

- [x] **3.8** Actualizar `UsersList.tsx`:
  - Agregar botones de acción por fila (Editar, Eliminar)
  - Agregar botón "Crear Usuario"
  - Integrar paginación
  - Mostrar badge de `is_superuser`
  - Mostrar `created_at` formateado
- [x] **3.9** Crear `src/features/users/UserForm.tsx` — formulario modal para crear/editar usuario:
  - Campos: email, first_name, last_name, password (solo en creación), is_active, is_superuser
  - Validación frontend alineada con las restricciones del backend (email válido, password min 8 chars, nombres min 1 / max 100)
- [x] **3.10** Crear `src/features/users/UserDeleteConfirm.tsx` — confirmación antes de eliminar
- [x] **3.11** Crear `src/features/users/UserRolesManager.tsx` — sección para ver y gestionar los roles asignados a un usuario (assign/revoke)

### Módulo de Roles

- [x] **3.12** Actualizar `RolesList.tsx`:
  - Agregar botones de acción por fila (Editar, Eliminar)
  - Agregar botón "Crear Rol"
  - Integrar paginación
  - Mostrar timestamps
- [x] **3.13** Crear `src/features/roles/RoleForm.tsx` — formulario modal para crear/editar rol:
  - Campos: name (min 2, max 50), description (max 255)
- [x] **3.14** Crear `src/features/roles/RoleDeleteConfirm.tsx`

---

## Fase 4 — Seguridad y Persistencia de Sesión
> *El backend usa JWT dual (access token en memoria + refresh token en cookie httpOnly). El frontend debe adaptarse.*

- [x] **4.1** El `access_token` debe almacenarse SOLO en memoria (Redux state) — **nunca en localStorage** ✅ (ya es así)
- [x] **4.2** Implementar lógica de "rehidratación de sesión" al cargar la app:
  - Al montar `App.tsx`, intentar POST `/auth/refresh` (la cookie httpOnly se envía automáticamente)
  - Si el refresh es exitoso → obtener nuevo access_token y llamar a `/users/me` → setCredentials
  - Si falla → redirigir a login
- [x] **4.3** Actualizar `ProtectedRoute` para manejar el estado "verificando sesión" (mostrar spinner mientras se intenta el refresh)
- [x] **4.4** Implementar auto-refresh proactivo del token antes de que expire (decodificar `exp` del JWT y programar refresh)
- [x] **4.5** Asegurar que `logout` haga POST a `/auth/logout` (para que el backend borre la cookie del refresh token) además de limpiar el estado de Redux

---

## Fase 5 — Testing Robusto
> *Corregir los tests existentes y ampliar la cobertura.*

- [x] **5.1** Actualizar `mocks/server.ts` con todos los handlers necesarios (ver 2.8) usando el formato `StandardResponse`
- [x] **5.2** Corregir y ampliar `Login.test.tsx`:
  - Test de renderizado del formulario
  - Test de login exitoso (verificar dispatch de credenciales + navegación)
  - Test de credenciales inválidas (verificar mensaje de error)
  - Test de estado de carga (botón deshabilitado)
- [x] **5.3** Corregir y ampliar `UsersList.test.tsx`:
  - Test de carga y renderizado de lista
  - Test de estado de error
  - Test de lista vacía
- [x] **5.4** Crear `RolesList.test.tsx`:
  - Tests análogos al de UsersList
- [x] **5.5** Crear tests para `UserForm.tsx`:
  - Test de validación de campos
  - Test de envío exitoso (crear y editar)
- [x] **5.6** Crear tests para `RoleForm.tsx`
- [x] **5.7** Crear tests para el flujo de rehidratación de sesión
- [x] **5.8** Crear tests para `ProtectedRoute` (acceso autenticado vs redireccionamiento)
- [x] **5.9** Verificar cobertura de tests con `npx jest --coverage` — objetivo: > 80%

---

## Fase 6 — UX/UI y Pulido Final
> *Mejoras de experiencia de usuario y calidad de código.*

- [x] **6.1** Implementar diseño **mobile-first** responsive en todos los componentes
- [x] **6.2** Deshabilitar botones mientras operaciones están en progreso (evitar doble envío)
- [x] **6.3** Implementar feedback inmediato con toasts/notificaciones para:
  - Login exitoso / fallido
  - CRUD de usuarios (creado, actualizado, eliminado)
  - CRUD de roles
  - Asignación/revocación de roles
- [x] **6.4** Implementar lazy loading de rutas (`React.lazy` + `Suspense`)
- [x] **6.5** Agregar `<title>` dinámico por página
- [x] **6.6** Mejorar accesibilidad (labels correctos, `aria-*`, contraste, navegación por teclado)
- [x] **6.7** Limpiar código: eliminar imports no usados, `console.log`, código comentado
- [x] **6.8** Agregar archivo `.env` con `VITE_API_BASE_URL=http://localhost:8000/api/v1` y usar `import.meta.env.VITE_API_BASE_URL` en el `apiSlice` en lugar de URL hardcoded

---

## Referencia Rápida — Contratos del Backend

### Estructura de Respuesta Estándar
```json
{
  "data": "T (el dato o array de datos)",
  "meta": { "total": 10, "skip": 0, "limit": 100 },
  "message": "Opcional"
}
```

### Endpoints de la API

| Método | Endpoint | Auth | Body | Respuesta |
|--------|----------|------|------|-----------|
| POST | `/auth/login` | No | `{ email, password }` | `{ access_token, token_type }` + cookie httpOnly |
| POST | `/auth/refresh` | Cookie | — | `{ access_token, token_type }` |
| POST | `/auth/logout` | No | — | `{ detail }` |
| GET | `/users/me` | Bearer | — | `StandardResponse<UserPublic>` |
| GET | `/users/?skip=0&limit=100` | Admin/Manager | — | `StandardResponse<UserPublic[]>` + meta |
| GET | `/users/{id}` | Bearer | — | `StandardResponse<UserPublic>` |
| POST | `/users/` | Admin | `UserCreate` | `StandardResponse<UserPublic>` (201) |
| PUT | `/users/{id}` | Admin | `UserUpdate` | `StandardResponse<UserPublic>` |
| PATCH | `/users/{id}` | Admin | `UserUpdate` parcial | `StandardResponse<UserPublic>` |
| DELETE | `/users/{id}` | Admin | — | `204 No Content` |
| GET | `/roles/?skip=0&limit=100` | Admin | — | `StandardResponse<RolePublic[]>` + meta |
| GET | `/roles/{id}` | Admin | — | `StandardResponse<RolePublic>` |
| POST | `/roles/` | Admin | `RoleCreate` | `StandardResponse<RolePublic>` (201) |
| PUT | `/roles/{id}` | Admin | `RoleUpdate` | `StandardResponse<RolePublic>` |
| DELETE | `/roles/{id}` | Admin | — | `204 No Content` |
| POST | `/roles/{roleId}/assign/{userId}` | Admin | — | `{ detail }` |
| DELETE | `/roles/{roleId}/revoke/{userId}` | Admin | — | `{ detail }` |

### Credenciales Seed
- **Email:** `admin@example.com`
- **Password:** `Admin123!`
- **Roles seed:** Admin, User, Manager

---

## Orden de Ejecución Recomendado

```
Fase 0 → Bugs críticos (30 min)
Fase 1 → Tipos TypeScript (1 hora)
Fase 2 → Capa de datos alineada con backend (2 horas)
Fase 4 → Seguridad y sesión (1 hora)  ← antes de UI para que el flujo funcione
Fase 3 → Componentes UI completos (3-4 horas)
Fase 5 → Testing (2 horas)
Fase 6 → Pulido final (1 hora)
```

> **IMPORTANTE:** Se recomienda ejecutar Fase 0 → 1 → 2 → 4 primero, ya que establecen la base correcta sobre la cual construir la UI (Fase 3) y los tests (Fase 5).
