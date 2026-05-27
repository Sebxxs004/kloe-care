package com.universidad.kloe_care;

import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.MessageRepository;
import com.universidad.kloe_care.repository.SolicitudRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SolicitudSecurityTest {

    @Value("${local.server.port}")
    private int port;

    private RestTemplate restTemplate;

    @Autowired private MessageRepository messageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private SolicitudRepository solicitudRepository;

    private static final String USER_EMAIL = "security@test.com";

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            protected boolean hasError(HttpStatusCode statusCode) { return false; }
        });
        messageRepository.deleteAll();
        solicitudRepository.deleteAll();
        userRepository.deleteAll();
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        userRepository.save(new User("Security Test", USER_EMAIL, enc.encode("pass12345"), "3001111111"));
    }

    private String url(String path) { return "http://localhost:" + port + path; }

    @Test
    void postSolicitud_sinAutenticacion_retorna401() {
        Map<String, String> body = new HashMap<>();
        body.put("tipo", "SOPORTE");
        body.put("descripcion", "Test sin auth");
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> r = restTemplate.postForEntity(
                url("/api/solicitudes"), new HttpEntity<>(body, h), String.class);
        assertEquals(HttpStatus.UNAUTHORIZED, r.getStatusCode());
    }

    @Test
    void postSolicitud_conUsuarioAutenticado_retorna201() {
        Map<String, String> body = new HashMap<>();
        body.put("tipo", "SOPORTE");
        body.put("descripcion", "Solicitud de prueba de seguridad");
        HttpHeaders h = new HttpHeaders();
        h.set("X-User-Email", USER_EMAIL);
        h.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> r = restTemplate.postForEntity(
                url("/api/solicitudes"), new HttpEntity<>(body, h), String.class);
        assertEquals(HttpStatus.CREATED, r.getStatusCode());
    }

    @Test
    void aprobarSolicitud_conRolUser_retorna403() {
        HttpHeaders h = new HttpHeaders();
        h.set("X-User-Email", USER_EMAIL);
        h.set("X-User-Role", "USER");
        ResponseEntity<String> r = restTemplate.exchange(
                url("/api/solicitudes/00000000-0000-0000-0000-000000000000/aprobar?observacion=intento"),
                HttpMethod.PUT, new HttpEntity<>(h), String.class);
        assertEquals(HttpStatus.FORBIDDEN, r.getStatusCode());
    }
}