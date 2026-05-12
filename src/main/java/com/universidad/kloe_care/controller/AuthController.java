package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.LoginRequest;
import com.universidad.kloe_care.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador que expone el endpoint de autenticación.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        log.info("Petición de login recibida para email={}", request.getEmail());

        boolean success = authService.login(request);

        if (!success) {
            log.error("Login fallido para email={}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        return ResponseEntity.ok("Login exitoso");
    }
}