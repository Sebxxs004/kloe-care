package com.universidad.kloe_care.service;

import com.universidad.kloe_care.dto.LoginRequest;
import com.universidad.kloe_care.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio que gestiona la autenticación del usuario.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    public boolean login(LoginRequest request) {
        log.info("Intento de login para email={}", request.getEmail());

        // Validación básica de campos vacíos
        if (request.getEmail() == null || request.getPassword() == null
                || request.getEmail().isBlank() || request.getPassword().isBlank()) {
            log.warn("Login fallido: campos vacíos para email={}", request.getEmail());
            return false;
        }

        Optional<User> user = userService.findByEmail(request.getEmail().trim().toLowerCase());
        if (user.isEmpty()) {
            log.warn("Login fallido: no existe usuario para email={}", request.getEmail());
            return false;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean passwordMatches = encoder.matches(request.getPassword(), user.get().getPassword());
        if (!passwordMatches) {
            log.warn("Login fallido: contraseña incorrecta para email={}", request.getEmail());
            return false;
        }

        log.info("Login exitoso para email={}", request.getEmail());
        return true;
    }
}
