# Kloe Care

> Plataforma integral de gestión y cuidado de mascotas. Registra la salud, alimentación, vacunas, medicamentos y actividad de tu compañero en un solo lugar.

---

## Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Requisitos Previos](#-requisitos-previos)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [API REST — Endpoints](#-api-rest--endpoints)
- [Modelo de Datos](#-modelo-de-datos)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Autores](#-autores)

---

## Descripción General

**Kloe Care** es una aplicación web de gestión veterinaria y seguimiento de mascotas desarrollada como proyecto universitario. Permite a los dueños de mascotas registrar y consultar toda la información de salud, alimentación, vacunas, medicamentos y actividad de sus animales.

El sistema está compuesto por:
- Un **backend REST** construido con Spring Boot que expone los datos a través de una API.
- Un **frontend moderno** en Next.js que consume dicha API y sirve la interfaz de usuario.
- Una **base de datos PostgreSQL** alojada en Supabase.

---

## Arquitectura del Proyecto

```
┌─────────────────────────────────┐      ┌────────────────────────────┐
│   Frontend — Next.js 13         │      │  Backend — Spring Boot 4   │
│   Puerto: 3000                  │◄────►│  Puerto: 8080              │
│   /frontend                     │ HTTP │  REST API                  │
│                                 │      │  Autenticación BCrypt       │
└─────────────────────────────────┘      └──────────────┬─────────────┘
                                                         │ JPA / Hibernate
                                                         ▼
                                          ┌──────────────────────────┐
                                          │  Supabase (PostgreSQL)   │
                                          │  Base de datos en la nube│
                                          └──────────────────────────┘
```

> **Importante:** Ambos servicios deben ejecutarse de forma simultánea para el correcto funcionamiento de la aplicación. El frontend se comunica con el backend a través de peticiones HTTP.

---

## Tecnologías

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 4.0.6 | Framework web |
| Spring Data JPA | — | Persistencia ORM |
| Hibernate | — | ORM / Dialect PostgreSQL |
| Spring Security Crypto | — | Hash de contraseñas (BCrypt) |
| Spring Validation | — | Validación de entidades |
| Thymeleaf | — | Vistas de administración básica |
| PostgreSQL Driver | — | Conexión a base de datos |
| Maven | — | Gestión de dependencias y build |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 13.4.7 | Framework React (App Router) |
| React | 18.2.0 | Librería de UI |
| TypeScript | 6.0.3 | Tipado estático |
| Supabase JS | 2.36.0 | Cliente Supabase para operaciones adicionales |
| CSS Vanilla | — | Estilos personalizados (sin frameworks CSS) |
| Inter (Google Fonts) | — | Tipografía principal |

### Infraestructura
| Tecnología | Uso |
|---|---|
| Supabase | Base de datos PostgreSQL en la nube |
| Git | Control de versiones |

---

## Estructura del Repositorio

```
kloe-care/                          ← Repositorio raíz (Git)
└── kloe-care/                      ← Proyecto Maven (Spring Boot)
    ├── frontend/                   ← Proyecto Next.js (frontend)
    │   ├── app/
    │   │   ├── layout.tsx          ← Layout raíz (fuentes, metadata)
    │   │   ├── page.tsx            ← Redirección a /login
    │   │   ├── login/              ← Autenticación y registro
    │   │   ├── dashboard/          ← Vista principal con resumen general
    │   │   ├── salud/              ← Registro de salud
    │   │   ├── comida/             ← Registro de alimentación
    │   │   ├── actividad/          ← Registro de actividad física
    │   │   ├── historial/          ← Historial de registros
    │   │   ├── perfil/             ← Perfil de usuario y mascota
    │   │   └── components/         ← Navbar, guard de sesión e íconos
    │   ├── public/
    │   │   └── images/
    │   │       ├── logo-nobackground.png
    │   │       └── foondo-login.png
    │   ├── utils/
    │   │   └── supabase/           ← Clientes Supabase (client/server/middleware)
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── src/
    │   └── main/
    │       ├── java/com/universidad/kloe_care/
    │       │   ├── KloeCareApplication.java
    │       │   ├── controller/     ← Controladores REST y Web
    │       │   ├── dto/            ← Data Transfer Objects
    │       │   ├── model/          ← Entidades JPA
    │       │   ├── repository/     ← Repositorios Spring Data
    │       │   └── service/        ← Lógica de negocio
    │       ├── resources/
    │       │   ├── application.properties
    │       │   ├── static/css/     ← CSS de vistas Thymeleaf
    │       │   └── templates/      ← Vistas Thymeleaf (admin básico)
    │       └── webapp/             ← Configuración WAR (web.xml)
    │
    ├── supabase_schema.sql         ← DDL completo de la base de datos
    └── pom.xml                     ← Configuración Maven
```

> Nota: el módulo de Bienestar fue eliminado del frontend; el README solo conserva el historial interno que usa el backend como soporte de datos.

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de iniciar:

- **Java 21+** — [Descargar](https://adoptium.net/)
- **Maven 3.9+** — [Descargar](https://maven.apache.org/)
- **Node.js 18+** — [Descargar](https://nodejs.org/)
- **Git** — [Descargar](https://git-scm.com/)
- Cuenta en **Supabase** con el proyecto configurado — [supabase.com](https://supabase.com)

---

## Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd kloe-care/kloe-care
```

### 2. Configurar la base de datos

Ejecuta el archivo `supabase_schema.sql` en tu proyecto de Supabase desde el **SQL Editor** del dashboard, o usando el CLI:

```bash
psql -h <host-supabase> -U postgres -d postgres -f supabase_schema.sql
```

### 3. Variables de entorno — Backend

Las variables se configuran como variables de entorno del sistema o en `application.properties`:

```properties
# application.properties (o como variables de entorno)
SUPABASE_DB_URL=jdbc:postgresql://<host>:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=<tu-password>
SPRING_JPA_HBM2DDL=validate   # opciones: validate | update | create-drop | none
```

### 4. Variables de entorno — Frontend

Crea el archivo `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<tu-key>
```

> **No subas** `.env.local` al repositorio. Ya está en `.gitignore`.

---

## Ejecución del Proyecto

El proyecto requiere **dos terminales** corriendo simultáneamente.

### Terminal 1 — Backend (Spring Boot)

```bash
cd kloe-care/kloe-care
./mvnw spring-boot:run
```

> En Windows usar: `mvnw.cmd spring-boot:run`

El backend estará disponible en: **`http://localhost:8080`**

Las vistas de administración básicas (Thymeleaf) estarán en:
- `http://localhost:8080/` — Dashboard
- `http://localhost:8080/users-ui` — Usuarios
- `http://localhost:8080/pets-ui` — Mascotas
- `http://localhost:8080/health-ui` — Salud
- `http://localhost:8080/feeding-ui` — Alimentación

### Terminal 2 — Frontend (Next.js)

```bash
cd kloe-care/kloe-care/frontend
npm install        # solo la primera vez
npm run dev
```

El frontend estará disponible en: **`http://localhost:3000`**

La ruta raíz (`/`) redirige automáticamente a `/login`.

---

## API REST — Endpoints

El backend corre en `http://localhost:8080`.

### Autenticación
| Método | Endpoint | Descripción | Body |
|---|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión | `{ "email": "", "password": "" }` |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users` | Listar todos los usuarios |
| `GET` | `/api/users/{id}` | Obtener usuario por ID |
| `POST` | `/api/users` | Registrar nuevo usuario |
| `PUT` | `/api/users/{id}` | Actualizar usuario |
| `DELETE` | `/api/users/{id}` | Eliminar usuario |

### Mascotas
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/pets` | Listar todas las mascotas |
| `GET` | `/api/pets/{id}` | Obtener mascota por ID |
| `POST` | `/api/pets` | Registrar nueva mascota |
| `PUT` | `/api/pets/{id}` | Actualizar mascota |
| `DELETE` | `/api/pets/{id}` | Eliminar mascota |

### Salud
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Listar registros de salud |
| `POST` | `/api/health` | Crear registro de salud |
| `PUT` | `/api/health/{id}` | Actualizar registro |
| `DELETE` | `/api/health/{id}` | Eliminar registro |

### Alimentación
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/feedings` | Listar registros de alimentación |
| `POST` | `/api/feedings` | Crear registro de alimentación |
| `PUT` | `/api/feedings/{id}` | Actualizar registro |
| `DELETE` | `/api/feedings/{id}` | Eliminar registro |

### Vacunas
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/vaccines` | Listar vacunas |
| `POST` | `/api/vaccines` | Registrar vacuna |
| `PUT` | `/api/vaccines/{id}` | Actualizar vacuna |
| `DELETE` | `/api/vaccines/{id}` | Eliminar vacuna |

### Medicamentos
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/medications` | Listar medicamentos |
| `POST` | `/api/medications` | Registrar medicamento |
| `PUT` | `/api/medications/{id}` | Actualizar medicamento |
| `DELETE` | `/api/medications/{id}` | Eliminar medicamento |

### Actividades
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/activities` | Listar actividades |
| `POST` | `/api/activities` | Registrar actividad |
| `PUT` | `/api/activities/{id}` | Actualizar actividad |
| `DELETE` | `/api/activities/{id}` | Eliminar actividad |

### Historial interno de bienestar

> Este historial sigue existiendo como soporte de datos para relacionar salud, alimentación y actividad, pero ya no se expone como módulo separado en el frontend.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/wellness-history` | Listar historiales |
| `POST` | `/api/wellness-history` | Crear historial |
| `PUT` | `/api/wellness-history/{id}` | Actualizar historial |
| `DELETE` | `/api/wellness-history/{id}` | Eliminar historial |

---

## Modelo de Datos

```
users
├── id (UUID, PK)
├── full_name
├── email (UNIQUE)
├── password (BCrypt)
└── phone_number

pets
├── id (UUID, PK)
├── name, species, breed
├── age, weight, sex
├── birth_date
└── owner_id (FK → users)

healths               feedings              activities
├── temperature       ├── food_type[]       ├── activity_type
├── weight            ├── food_brand        ├── duration
├── symptoms[]        ├── amount            └── observations
└── observations      ├── schedule
                      ├── frequency
                      └── observations

vaccines              medications           wellness_histories
├── name              ├── name              ├── general_notes
├── laboratory        ├── dosage            └── pet_id (FK → pets)
├── applied_at        ├── frequency
├── next_dose_at      ├── start_date
└── notes             ├── end_date
                      └── notes
```

---

## Funcionalidades Implementadas

- [x] **RF1** — Registro de usuarios con contraseña hasheada (BCrypt)
- [x] **RF2** — Registro de mascotas con asociación a propietario
- [x] **RF3** — Actualización y eliminación de mascotas
- [x] **RF4** — Registros de salud (temperatura, peso, síntomas)
- [x] **RF5** — Registros de alimentación
- [x] Gestión de vacunas y medicamentos
- [x] Registro de actividades físicas
- [x] Historial interno de bienestar por mascota para soporte de registros
- [x] Autenticación por email y contraseña (`POST /auth/login`)
- [x] Página de login con diseño premium (split layout, animaciones, preloader)
- [x] Frontend integrado dentro del proyecto Maven

---

## Autores
 Sebastian Cano, Oriana Jaimes, Johan Carreño
 
Proyecto desarrollado para la asignatura de **Programacion Web** — Universidad.

> Kloe Care © 2025 — Hecho con 🐾 y mucho amor por las mascotas.
