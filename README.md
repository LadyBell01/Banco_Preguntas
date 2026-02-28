# RadioEdu-API - Banco de Preguntas

API REST para la gestión de usuarios, cursos, unidades, categorías y banco de preguntas educativas, desarrollada con Node.js, TypeScript y arquitectura hexagonal (Puertos y Adaptadores).

## Descripción

Este proyecto implementa un sistema de gestión académica y banco de preguntas con autenticación JWT. Permite realizar operaciones CRUD sobre usuarios, cursos, unidades, categorías y preguntas con sus opciones de respuesta. Incluye validación de datos, contraseñas hasheadas y lógica de negocio para garantizar que cada pregunta tenga exactamente una opción correcta.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **TypeScript** - Lenguaje de programación
- **Express** - Framework web
- **TypeORM** - ORM para la base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcryptjs** - Hasheo seguro de contraseñas
- **Joi** - Validación de datos
- **dotenv** - Gestión de variables de entorno

## Arquitectura del Proyecto

El proyecto sigue una **arquitectura hexagonal** (Puertos y Adaptadores) con inyección de dependencias:

```
src/
├── domain/                         # Capa de Dominio
│   ├── entities/                   # Modelos e interfaces
│   │   ├── User.ts                # Interfaz y Enum de usuario
│   │   ├── Category.ts            # Interfaz del modelo de categoría
│   │   ├── Course.ts              # Interfaz del modelo de curso
│   │   ├── Unit.ts                # Interfaz del modelo de unidad
│   │   ├── Question.ts            # Interfaz y Enums de pregunta
│   │   ├── Option.ts              # Interfaz del modelo de opción
│   │   ├── QuestionValidation.ts  # Interfaz de validación
│   │   └── index.ts               # Barrel export
│   ├── ports/                      # Definición de interfaces de Repositorios
│   │   ├── UserPort.ts            # Puerto para operaciones de usuario
│   │   ├── CategoryPort.ts        # Puerto para operaciones de categoría
│   │   ├── CoursePort.ts          # Puerto para operaciones de curso
│   │   ├── UnitPort.ts            # Puerto para operaciones de unidad
│   │   ├── QuestionPort.ts        # Puerto para operaciones de pregunta
│   │   ├── OptionPort.ts          # Puerto para operaciones de opción
│   │   ├── QuestionValidationPort.ts # Puerto para validaciones
│   │   └── index.ts               # Barrel export
│   └── index.ts                   # Barrel export principal
│
├── application/                    # Capa de Aplicación
│   ├── use-cases/                  # Lógica de negocio (Casos de Uso)
│   │   ├── AuthUseCase.ts         # Autenticación (JWT)
│   │   ├── UserUseCase.ts         # Lógica de usuarios
│   │   ├── CategoryUseCase.ts     # Lógica de categorías
│   │   ├── CourseUseCase.ts       # Lógica de cursos
│   │   ├── UnitUseCase.ts         # Lógica de unidades
│   │   ├── QuestionUseCase.ts     # Lógica de preguntas y opciones
│   │   ├── ValidationUseCase.ts   # Lógica de validaciones
│   │   └── index.ts               # Barrel export
│   └── index.ts                   # Barrel export principal
│
└── infraestructure/               # Capa de Infraestructura
    ├── adapter/                    # Implementación TypeORM (Repositories)
    │   ├── UserAdapter.ts         # Adaptador de usuario
    │   ├── CategoryAdapter.ts     # Adaptador de categoría
    │   ├── CourseAdapter.ts       # Adaptador de curso
    │   ├── UnitAdapter.ts         # Adaptador de unidad
    │   ├── QuestionAdapter.ts     # Adaptador de pregunta
    │   ├── OptionAdapter.ts       # Adaptador de opción
    │   └── QuestionValidationAdapter.ts # Adaptador de validación
    ├── controller/                 # Controladores de Express
    │   ├── UserController.ts
    │   ├── CategoryController.ts
    │   ├── CourseController.ts
    │   ├── UnitController.ts
    │   ├── QuestionController.ts
    │   └── ValidationController.ts
    ├── entities/                   # Entidades de TypeORM (Mapeo BD)
    │   ├── User.ts
    │   ├── Category.ts
    │   ├── Course.ts
    │   ├── Unit.ts
    │   ├── Question.ts
    │   ├── Option.ts
    │   └── QuestionValidation.ts
    ├── routes/                     # Definición de endpoints
    │   ├── UserRoutes.ts
    │   ├── CategoryRoutes.ts
    │   ├── CourseRoutes.ts
    │   ├── UnitRoutes.ts
    │   ├── QuestionRoutes.ts
    │   └── ValidationRoutes.ts
    ├── web/
    │   ├── app.ts                 # Configuración de Express
    │   ├── authMiddleware.ts      # Middleware de autenticación JWT
    │   ├── roleMiddleware.ts      # Middleware de control de roles
    │   └── errorMiddleware.ts     # Middleware centralizado de errores
    ├── config/
    │   ├── data-base.ts           # Configuración de TypeORM
    │   └── environment-vars.ts
    ├── bootstrap/
    │   └── server.bootstrap.ts
    └── Util/
        ├── user-validation.ts
        ├── user-update-validation.ts
        ├── category-validation.ts
        ├── course-validation.ts
        ├── unit-validation.ts
        ├── question-validation.ts
        └── validation-validation.ts
```

## Inyección de Dependencias

El proyecto utiliza inyección de dependencias en la capa de infraestructura. Los adaptadores (que implementan los puertos del dominio) se instancian y pasan a los casos de uso a través del constructor:

```typescript
// En las rutas (infraestructure/routes/)
const userAdapter = new UserAdapter();
const userUseCase = new UserUseCase(userAdapter);
const userController = new UserController(userUseCase);
```

## Manejo Centralizado de Errores

El proyecto incluye un middleware centralizado para el manejo de errores que proporciona respuestas JSON consistentes:

```typescript
// Clases de error disponibles
- AppError         // Error base (500)
- BadRequestError  // Error de solicitud (400)
- UnauthorizedError // No autorizado (401)
- ForbiddenError   // Acceso denegado (403)
- NotFoundError    // No encontrado (404)
- ConflictError    // Conflicto (409)
- ValidationError  // Error de validación (400)

// Formato de respuesta de error
{ "error": "Mensaje de error", "details": "..." }
```

## Modelos de Datos

### Usuario

| Campo    | Tipo   | Descripción                           |
| -------- | ------ | ------------------------------------- |
| id       | number | Identificador único                   |
| name     | string | Nombre del usuario                    |
| email    | string | Correo electrónico (único)            |
| password | string | Contraseña (hasheada con bcrypt)      |
| role     | Enum   | Rol (Admin, Docente, DocenteExperto)  |
| status   | number | Estado del usuario (1=activo, 0=baja) |

### Categoría

| Campo       | Tipo   | Descripción                 |
| ----------- | ------ | --------------------------- |
| id          | number | Identificador único         |
| name        | string | Nombre de la categoría      |
| description | string | Descripción de la categoría |
| status      | number | Estado (1=activo, 0=baja)   |

### Curso

| Campo       | Tipo   | Descripción               |
| ----------- | ------ | ------------------------- |
| id          | number | Identificador único       |
| name        | string | Nombre del curso          |
| description | string | Descripción del curso     |
| status      | number | Estado (1=activo, 0=baja) |

### Unidad

| Campo       | Tipo   | Descripción                   |
| ----------- | ------ | ----------------------------- |
| id          | number | Identificador único           |
| name        | string | Nombre de la unidad           |
| description | string | Descripción de la unidad      |
| courseId    | number | ID del curso al que pertenece |
| status      | number | Estado (1=activo, 0=baja)     |

### Pregunta (Question)

| Campo      | Tipo   | Descripción                                                 |
| ---------- | ------ | ----------------------------------------------------------- |
| id         | number | Identificador único                                         |
| statement  | string | Enunciado de la pregunta                                    |
| difficulty | Enum   | Dificultad (Baja, Media, Alta)                              |
| categoryId | number | ID de la categoría                                          |
| status     | Enum   | Estado (Borrador, Revisión, Aprobada, Rechazada, Publicada) |
| active     | number | Activo (1=activo, 0=baja)                                   |

### Opción (Option)

| Campo      | Tipo    | Descripción                          |
| ---------- | ------- | ------------------------------------ |
| id         | number  | Identificador único                  |
| text       | string  | Texto de la opción                   |
| isCorrect  | boolean | Indica si es la opción correcta      |
| questionId | number  | ID de la pregunta a la que pertenece |
| active     | number  | Activo (1=activo, 0=baja)            |

## Enums

### Difficulty (Dificultad)

- `Baja` - Pregunta de dificultad baja
- `Media` - Pregunta de dificultad media
- `Alta` - Pregunta de dificultad alta

### QuestionStatus (Estado de Pregunta)

- `Borrador` - Pregunta en proceso de creación
- `Revisión` - Pregunta pendiente de revisión por Docente Experto
- `Aprobada` - Pregunta aprobada por Docente Experto
- `Rechazada` - Pregunta rechazada por Docente Experto
- `Publicada` - Pregunta disponible para uso

### UserRole (Rol de Usuario)

- `Admin` - Administrador del sistema
- `Docente` - Docente que crea preguntas
- `DocenteExperto` - Docente que valida/aprueba preguntas

### QuestionValidation (Validación de Pregunta)

| Campo        | Tipo   | Descripción                       |
| ------------ | ------ | --------------------------------- |
| id           | number | Identificador único               |
| questionId   | number | ID de la pregunta validada        |
| validatorId  | number | ID del docente experto que validó |
| result       | Enum   | Resultado (Aprobada, Rechazada)   |
| observations | string | Observaciones del validador       |
| validatedAt  | Date   | Fecha y hora de la validación     |

## Relaciones

- Un **Course** tiene muchas **Units** (1:N)
- Una **Category** agrupa muchas **Questions** (1:N)
- Una **Question** tiene muchas **Options** (1:N)
- Una **Question** puede tener muchas **QuestionValidations** (historial) (1:N)
- Un **User** (DocenteExperto) puede crear muchas **QuestionValidations** (1:N)

## Endpoints de la API

Base URL: `/api`

### Autenticación

| Método | Endpoint | Descripción    | Autenticación |
| ------ | -------- | -------------- | ------------- |
| POST   | `/login` | Iniciar sesión | No            |

### Usuarios

| Método | Endpoint              | Descripción                    | Autenticación |
| ------ | --------------------- | ------------------------------ | ------------- |
| POST   | `/users`              | Crear nuevo usuario            | No            |
| GET    | `/users`              | Obtener todos los usuarios     | Sí (JWT)      |
| GET    | `/users/email/:email` | Buscar usuario por email       | Sí (JWT)      |
| PUT    | `/users/:id`          | Actualizar usuario             | No            |
| DELETE | `/users/:id`          | Eliminar usuario (baja lógica) | No            |

### Categorías

| Método | Endpoint          | Descripción                      | Autenticación |
| ------ | ----------------- | -------------------------------- | ------------- |
| POST   | `/categories`     | Crear nueva categoría            | Sí (JWT)      |
| GET    | `/categories`     | Obtener todas las categorías     | Sí (JWT)      |
| GET    | `/categories/:id` | Obtener categoría por ID         | Sí (JWT)      |
| PUT    | `/categories/:id` | Actualizar categoría             | Sí (JWT)      |
| DELETE | `/categories/:id` | Eliminar categoría (baja lógica) | Sí (JWT)      |

### Cursos

| Método | Endpoint       | Descripción                  | Autenticación |
| ------ | -------------- | ---------------------------- | ------------- |
| POST   | `/courses`     | Crear nuevo curso            | Sí (JWT)      |
| GET    | `/courses`     | Obtener todos los cursos     | Sí (JWT)      |
| GET    | `/courses/:id` | Obtener curso por ID         | Sí (JWT)      |
| PUT    | `/courses/:id` | Actualizar curso             | Sí (JWT)      |
| DELETE | `/courses/:id` | Eliminar curso (baja lógica) | Sí (JWT)      |

### Unidades

| Método | Endpoint                  | Descripción                   | Autenticación |
| ------ | ------------------------- | ----------------------------- | ------------- |
| POST   | `/units`                  | Crear nueva unidad            | Sí (JWT)      |
| GET    | `/units`                  | Obtener todas las unidades    | Sí (JWT)      |
| GET    | `/units/:id`              | Obtener unidad por ID         | Sí (JWT)      |
| GET    | `/units/course/:courseId` | Obtener unidades de un curso  | Sí (JWT)      |
| PUT    | `/units/:id`              | Actualizar unidad             | Sí (JWT)      |
| DELETE | `/units/:id`              | Eliminar unidad (baja lógica) | Sí (JWT)      |

### Preguntas

| Método | Endpoint                            | Descripción                      | Autenticación |
| ------ | ----------------------------------- | -------------------------------- | ------------- |
| POST   | `/questions`                        | Crear pregunta con opciones      | Sí (JWT)      |
| GET    | `/questions`                        | Obtener todas las preguntas      | Sí (JWT)      |
| GET    | `/questions/:id`                    | Obtener pregunta por ID          | Sí (JWT)      |
| GET    | `/questions/category/:categoryId`   | Obtener preguntas por categoría  | Sí (JWT)      |
| GET    | `/questions/difficulty/:difficulty` | Obtener preguntas por dificultad | Sí (JWT)      |
| GET    | `/questions/status/:status`         | Obtener preguntas por estado     | Sí (JWT)      |
| PUT    | `/questions/:id`                    | Actualizar pregunta              | Sí (JWT)      |
| PATCH  | `/questions/:id/status`             | Actualizar estado de pregunta    | Sí (JWT)      |
| PUT    | `/questions/:id/options`            | Actualizar opciones de pregunta  | Sí (JWT)      |
| DELETE | `/questions/:id`                    | Eliminar pregunta (baja lógica)  | Sí (JWT)      |

### Validaciones (Flujo Docente Experto)

| Método | Endpoint                                | Descripción                           | Autenticación        |
| ------ | --------------------------------------- | ------------------------------------- | -------------------- |
| POST   | `/validations`                          | Validar pregunta (aprobar/rechazar)   | JWT + DocenteExperto |
| GET    | `/validations/question/:questionId`     | Historial de validaciones de pregunta | Sí (JWT)             |
| GET    | `/validations/my-validations`           | Mis validaciones realizadas           | JWT + DocenteExperto |
| PATCH  | `/questions/:questionId/send-to-review` | Enviar pregunta a revisión            | Sí (JWT)             |
| PATCH  | `/questions/:questionId/publish`        | Publicar pregunta aprobada            | JWT + DocenteExperto |

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd BancoPreguntas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto:

   ```env
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_datos
   ```

4. **Configurar la base de datos**

   Asegúrate de tener PostgreSQL instalado y crear un schema llamado `users`.

## Scripts Disponibles

```bash
# Desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start
```

## Uso de la API

### Login

```bash
POST /api/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

Respuesta exitosa:

```json
{
  "message": "Login éxito",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Crear Usuario

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña123",
  "status": 1
}
```

### Obtener Usuarios (requiere autenticación)

```bash
GET /api/users
Authorization: Bearer <token>
```

### Actualizar Usuario

```bash
PUT /api/users/1
Content-Type: application/json

{
  "name": "Nuevo Nombre"
}
```

### Eliminar Usuario (baja lógica)

```bash
DELETE /api/users/1
```

### Crear Categoría (requiere autenticación)

```bash
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Matemáticas",
  "description": "Preguntas de matemáticas básicas"
}
```

### Crear Curso (requiere autenticación)

```bash
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Álgebra I",
  "description": "Curso introductorio de álgebra"
}
```

### Crear Unidad (requiere autenticación)

```bash
POST /api/units
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ecuaciones lineales",
  "description": "Unidad sobre ecuaciones de primer grado",
  "courseId": 1
}
```

### Obtener Unidades de un Curso

```bash
GET /api/units/course/1
Authorization: Bearer <token>
```

### Crear Pregunta con Opciones (requiere autenticación)

```bash
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "statement": "¿Cuál es la capital de Francia?",
  "difficulty": "Baja",
  "categoryId": 1,
  "status": "Borrador",
  "options": [
    { "text": "Madrid", "isCorrect": false },
    { "text": "París", "isCorrect": true },
    { "text": "Londres", "isCorrect": false },
    { "text": "Berlín", "isCorrect": false }
  ]
}
```

Respuesta exitosa:

```json
{
  "message": "Pregunta creada con éxito",
  "questionId": 1
}
```

### Obtener Pregunta con Opciones

```bash
GET /api/questions/1
Authorization: Bearer <token>
```

Respuesta:

```json
{
  "id": 1,
  "statement": "¿Cuál es la capital de Francia?",
  "difficulty": "Baja",
  "categoryId": 1,
  "status": "Borrador",
  "active": 1,
  "options": [
    {
      "id": 1,
      "text": "Madrid",
      "isCorrect": false,
      "questionId": 1,
      "active": 1
    },
    {
      "id": 2,
      "text": "París",
      "isCorrect": true,
      "questionId": 1,
      "active": 1
    },
    {
      "id": 3,
      "text": "Londres",
      "isCorrect": false,
      "questionId": 1,
      "active": 1
    },
    {
      "id": 4,
      "text": "Berlín",
      "isCorrect": false,
      "questionId": 1,
      "active": 1
    }
  ]
}
```

### Actualizar Estado de Pregunta

```bash
PATCH /api/questions/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Aprobada"
}
```

### Obtener Preguntas por Dificultad

```bash
GET /api/questions/difficulty/Alta
Authorization: Bearer <token>
```

### Obtener Preguntas por Estado

```bash
GET /api/questions/status/Publicada
Authorization: Bearer <token>
```

### Enviar Pregunta a Revisión (Docente)

```bash
PATCH /api/questions/1/send-to-review
Authorization: Bearer <token>
```

Respuesta:

```json
{
  "message": "Pregunta enviada a revisión exitosamente"
}
```

### Validar Pregunta (Solo Docente Experto)

```bash
POST /api/validations
Authorization: Bearer <token-docente-experto>
Content-Type: application/json

{
  "questionId": 1,
  "result": "Aprobada",
  "observations": "La pregunta cumple con los criterios de calidad. Redacción clara y opciones bien formuladas."
}
```

Respuesta exitosa:

```json
{
  "message": "Pregunta aprobada exitosamente",
  "validationId": 1
}
```

### Rechazar Pregunta (Solo Docente Experto)

```bash
POST /api/validations
Authorization: Bearer <token-docente-experto>
Content-Type: application/json

{
  "questionId": 2,
  "result": "Rechazada",
  "observations": "El enunciado es ambiguo. Por favor, reformule la pregunta para mayor claridad."
}
```

### Ver Historial de Validaciones de una Pregunta

```bash
GET /api/validations/question/1
Authorization: Bearer <token>
```

### Publicar Pregunta Aprobada (Solo Docente Experto)

```bash
PATCH /api/questions/1/publish
Authorization: Bearer <token-docente-experto>
```

## Flujo de Trabajo de Preguntas

```
1. DOCENTE crea pregunta → Estado: "Borrador"
2. DOCENTE envía a revisión → Estado: "Revisión"
3. DOCENTE_EXPERTO valida:
   - Si APRUEBA → Estado: "Aprobada"
   - Si RECHAZA → Estado: "Rechazada" (vuelve al docente para corregir)
4. DOCENTE_EXPERTO publica → Estado: "Publicada"
```

## Reglas de Negocio

### Preguntas

- Cada pregunta debe tener **mínimo 2 opciones** y **máximo 6 opciones**
- **Solo puede haber una opción correcta** por pregunta
- Las opciones se crean simultáneamente con la pregunta
- Al eliminar una pregunta, también se dan de baja sus opciones (baja lógica)

### Validaciones

- Solo usuarios con rol **DocenteExperto** o **Admin** pueden validar preguntas
- Solo se pueden validar preguntas en estado **"Revisión"**
- Las observaciones son obligatorias (mínimo 10 caracteres)
- Se guarda historial completo de validaciones por pregunta
- Una pregunta rechazada puede ser corregida y reenviada a revisión

## Características de Seguridad

- **Contraseñas hasheadas**: Las contraseñas se almacenan usando bcrypt con factor de costo 12
- **Autenticación JWT**: Los tokens expiran después de 1 hora e incluyen el rol del usuario
- **Control de acceso por roles**: Endpoints protegidos según rol (Admin, Docente, DocenteExperto)
- **Validación de emails únicos**: No se permiten emails duplicados
- **Baja lógica**: Al eliminar registros, solo se cambia el estado a 0 (no se eliminan físicamente)

## Dependencias Principales

```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.2.4",
  "joi": "^18.0.2",
  "jsonwebtoken": "^9.0.3",
  "pg": "^8.18.0",
  "typeorm": "^0.3.28"
}
```

## Dependencias de Desarrollo

```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/cors": "^2.8.19",
  "@types/express": "^5.0.6",
  "@types/jsonwebtoken": "^9.0.10",
  "nodemon": "^3.1.11",
  "tsx": "^4.21.0",
  "typescript": "^5.9.3"
}
```
