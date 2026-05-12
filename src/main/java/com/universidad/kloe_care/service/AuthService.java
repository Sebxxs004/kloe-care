package com.universidad.kloe_care.service;

import com.universidad.kloe_care.dto.LoginRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Servicio que gestiona la autenticación del usuario.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public boolean login(LoginRequest request) {
        log.info("Intento de login para email={}", request.getEmail());

        // Validación básica de campos vacíos
        if (request.getEmail() == null || request.getPassword() == null) {
            log.warn("Login fallido: campos vacíos para email={}", request.getEmail());
            return false;
        }

        // TODO: aquí va la validación real contra la base de datos
        log.info("Login exitoso para email={}", request.getEmail());
        return true;
    }
}