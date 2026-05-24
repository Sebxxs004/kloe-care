# Kloe Care — Backend

Resumen rápido para desarrollo y pruebas.

Arquitectura
- MVC con Spring Boot (controladores en `controller/`, lógica en `service/`, acceso a datos en `repository/`, entidades en `model/`, DTOs en `dto/`).

Endpoints principales
- Usuarios (RF1)
  - POST /api/users — Registrar usuario (body: `fullName,email,password[,phoneNumber]`)
  - GET /api/users — Listar usuarios
  - GET /api/users/{id} — Obtener usuario
  - PUT /api/users/{id} — Actualizar usuario
  - DELETE /api/users/{id} — Eliminar usuario

- Autenticación
  - POST /auth/login — Login (body: `email,password`) — valida contraseña hasheada

- Mascotas (RF2, RF3)
  - POST /api/pets — Crear mascota (body: `name,species,breed,age,weight,sex,birthDate,owner{ id }`)
  - GET /api/pets — Listar mascotas
  - GET /api/pets/{id} — Obtener mascota
  - PUT /api/pets/{id} — Actualizar mascota
  - DELETE /api/pets/{id} — Eliminar mascota

- Registros de salud (RF4)
  - POST /api/health-records — Crear registro de salud (body: `temperature,generalState,recordDate,symptoms[],vaccines[],medications[],observations`)
  - GET/PUT/DELETE /api/health-records/{id}

- Registros de alimentación (RF5)
  - POST /api/feedings — Crear registro de alimentación (body: `foodType,amount,schedule,frequency,nutritionalObservations`)
  - GET/PUT/DELETE /api/feedings/{id}

Tests
- Las pruebas de integración usan H2 en memoria (archivo: `src/test/resources/application.properties`).
- Ejecutar tests:

```powershell
cd c:\Users\sebas\Desktop\Repositorios\kloe-care\kloe-care
.\mvnw.cmd test
```

Notas
- Las contraseñas se almacenan con `BCryptPasswordEncoder`.
- El proyecto está configurado para PostgreSQL en `src/main/resources/application.properties` y para H2 en tests.

Si quieres, puedo:
- Crear DTOs/mappers adicionales (MapStruct) para separar entidad/entrada JSON.
- Añadir validación más estricta o control de excepciones global (`@ControllerAdvice`).
- Hacer commit y push de los cambios.
