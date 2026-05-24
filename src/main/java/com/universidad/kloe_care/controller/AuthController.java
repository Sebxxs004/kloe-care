package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.LoginRequest;
import com.universidad.kloe_care.dto.RegisterRequest;
import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.service.AuthService;
import com.universidad.kloe_care.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador que expone los endpoints de autenticación: login y registro.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    /** POST /auth/login — valida credenciales */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        log.info("Petición de login recibida para email={}", request.getEmail());

        boolean success = authService.login(request);

        if (!success) {
            log.warn("Login fallido para email={}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        return ResponseEntity.ok("Login exitoso");
    }

    /** POST /auth/register — crea un nuevo usuario */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        log.info("Petición de registro para email={}", request.getEmail());

        if (request.getEmail() == null || request.getPassword() == null
                || request.getEmail().isBlank() || request.getPassword().isBlank()
                || request.getFullName() == null || request.getFullName().isBlank()) {
            return ResponseEntity.badRequest().body("Nombre, correo y contraseña son obligatorios");
        }

        if (request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 8 caracteres");
        }

        try {
            User newUser = new User(
                    request.getFullName().trim(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhoneNumber()
            );
            userService.createUser(newUser);
            log.info("Usuario registrado exitosamente: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado exitosamente");
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            log.warn("Registro fallido: {}", ex.getReason());
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }
}