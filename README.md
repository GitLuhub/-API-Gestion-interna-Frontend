<p align="center">
  <h1 align="center">🖥️ Sistema de Gestión Interna — Frontend</h1>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?logo=typescript" />
  <img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux_Toolkit-2.2+-764ABC.svg?logo=redux" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5.2-646CFF.svg?logo=vite" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg" />
</p>

## 📖 Visión General

Este repositorio contiene el **Frontend (SPA)** del Sistema de Gestión Interna Empresarial. Está construido con **React y TypeScript**, y maneja un estado global robusto mediante **Redux Toolkit** y **RTK Query**. Ofrece una interfaz moderna, rápida y responsiva para interactuar con la API REST del sistema, enfocándose especialmente en la administración de Usuarios y Roles (RBAC).

## ✨ Características Principales

- **Arquitectura Basada en Features:** Código modular (Auth, Usuarios, Roles) para una fácil escalabilidad y lectura.
- **Tipado Estricto (TypeScript):** Tipos 100% sincronizados con los schemas Pydantic del backend.
- **Autenticación Resiliente (JWT Dual):** Integración con cookies `httpOnly` para un manejo seguro de la sesión, incluyendo rehidratación automática tras recargar.
- **Data Fetching Eficiente:** Integrado nativamente con **RTK Query** para caché, mutaciones y control de paginación de la API.
- **Diseño Moderno & Responsivo:** UI construida puramente con **Tailwind CSS**.
- **Testing Exhaustivo:** Cobertura de pruebas utilizando Jest, React Testing Library y Mock Service Worker (MSW).

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| **Framework UI** | React 18, Vite |
| **Lenguaje** | TypeScript (`strict: true`) |
| **State Management** | Redux Toolkit (State de cliente) |
| **Data Fetching** | RTK Query (State del servidor) |
| **Estilos** | Tailwind CSS |
| **Testing** | Jest, React Testing Library, MSW |
| **Enrutamiento** | React Router DOM v6 |

## 🚀 Guía de Inicio (Quickstart)

El proyecto utiliza **Vite** para un desarrollo ultra-rápido.

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (Versión 18+ recomendada)
- Instancia del [Backend API](https://github.com/tu-usuario/API-Gestion-interna) corriendo.

### 2. Configuración del Entorno
Clona el repositorio e instala las dependencias:
```bash
git clone https://github.com/tu-usuario/API-Gestion-interna-Frontend.git
cd API-Gestion-interna-Frontend
npm install
```

Crea tu archivo de variables de entorno:
```bash
cp .env.example .env
```
*(Asegúrate de que `VITE_API_BASE_URL` apunte a la URL de tu backend, por defecto: `http://localhost:8000/api/v1`)*

### 3. Levantar Servidor de Desarrollo
```bash
npm run dev
```
> La aplicación estará disponible en `http://localhost:3000`.

## 🧪 Pruebas y Cobertura

El proyecto contiene suites de pruebas unitarias y de integración que mockean las respuestas del servidor usando MSW.

```bash
# Correr tests una vez
npm run test

# Correr tests en modo escucha (watch)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 📁 Estructura del Proyecto

```text
src/
├── App.tsx          # Configuración de Rutas (React Router)
├── store/           # Configuración Redux Store y RTK Query API Base
├── features/        # Módulos funcionales (Auth, Users, Roles, Dashboard)
├── components/      # Componentes UI reutilizables (Layout, Modal, Toast)
├── types/           # Interfaces TS alineadas con la API
├── mocks/           # Intercepción de requests (MSW) para tests
└── config.ts        # Variables de entorno unificadas
```

---
**Desarrollado para brindar una experiencia de usuario rápida, segura y unificada con los estándares de la API REST.**
