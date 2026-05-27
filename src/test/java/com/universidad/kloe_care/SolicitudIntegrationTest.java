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
public class SolicitudIntegrationTest {

    @Value("${local.server.port}")
    private int port;

    private RestTemplate restTemplate;

    @Autowired private MessageRepository messageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private SolicitudRepository solicitudRepository;

    private static final String USER_EMAIL = "solicitante@test.com";
    private static final String ADMIN_EMAIL = "admin@test.com";

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
        userRepository.save(new User("Solicitante", USER_EMAIL, enc.encode("password123"), "3001234567"));
        userRepository.save(new User("Admin", ADMIN_EMAIL, enc.encode("password123"), "3007654321"));
    }

    private String url(String path) { return "http://localhost:" + port + path; }

    private HttpHeaders userHeaders(String email) {
        HttpHeaders h = new HttpHeaders();
        h.set("X-User-Email", email);
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    private HttpHeaders adminHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.set("X-User-Email", ADMIN_EMAIL);
        h.set("X-User-Role", "ADMIN");
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    private ResponseEntity<String> crearSolicitud(String email, String tipo, String desc) {
        Map<String, String> body = new HashMap<>();
        body.put("tipo", tipo);
        body.put("descripcion", desc);
        return restTemplate.postForEntity(url("/api/solicitudes"),
                new HttpEntity<>(body, userHeaders(email)), String.class);
    }

    private String extraerId(String json) {
        int idx = json.indexOf("\"id\":\"");
        if (idx == -1) return "";
        int start = idx + 6;
        return json.substring(start, json.indexOf("\"", start));
    }

    @Test void crearSolicitud_retorna201() {
        assertEquals(HttpStatus.CREATED, crearSolicitud(USER_EMAIL, "SOPORTE", "Necesito soporte").getStatusCode());
    }

    @Test void getMisSolicitudes_retorna200() {
        crearSolicitud(USER_EMAIL, "ACCESO", "Solicito acceso");
        ResponseEntity<String> r = restTemplate.exchange(url("/api/solicitudes/mis-solicitudes"),
                HttpMethod.GET, new HttpEntity<>(userHeaders(USER_EMAIL)), String.class);
        assertEquals(HttpStatus.OK, r.getStatusCode());
    }

    @Test void getAllSolicitudes_admin_retorna200() {
        ResponseEntity<String> r = restTemplate.exchange(url("/api/solicitudes"),
                HttpMethod.GET, new HttpEntity<>(adminHeaders()), String.class);
        assertEquals(HttpStatus.OK, r.getStatusCode());
    }

    @Test void getAllSolicitudes_sinAdmin_retorna403() {
        HttpHeaders h = new HttpHeaders();
        h.set("X-User-Email", USER_EMAIL);
        h.set("X-User-Role", "USER");
        ResponseEntity<String> r = restTemplate.exchange(url("/api/solicitudes"),
                HttpMethod.GET, new HttpEntity<>(h), String.class);
        assertEquals(HttpStatus.FORBIDDEN, r.getStatusCode());
    }

    @Test void aprobarSolicitud_retorna200() {
        String id = extraerId(crearSolicitud(USER_EMAIL, "INFORMACION", "Info").getBody());
        ResponseEntity<String> r = restTemplate.exchange(
                url("/api/solicitudes/" + id + "/aprobar?observacion=Aprobado"),
                HttpMethod.PUT, new HttpEntity<>(adminHeaders()), String.class);
        assertEquals(HttpStatus.OK, r.getStatusCode());
        assertTrue(r.getBody().contains("APROBADA"));
    }

    @Test void rechazarSolicitud_retorna200() {
        String id = extraerId(crearSolicitud(USER_EMAIL, "SOPORTE", "Test rechazar").getBody());
        ResponseEntity<String> r = restTemplate.exchange(
                url("/api/solicitudes/" + id + "/rechazar?observacion=Rechazado"),
                HttpMethod.PUT, new HttpEntity<>(adminHeaders()), String.class);
        assertEquals(HttpStatus.OK, r.getStatusCode());
        assertTrue(r.getBody().contains("RECHAZADA"));
    }

    @Test void aprobarSolicitud_noExiste_retorna404() {
        ResponseEntity<String> r = restTemplate.exchange(
                url("/api/solicitudes/00000000-0000-0000-0000-000000000000/aprobar?observacion=Test"),
                HttpMethod.PUT, new HttpEntity<>(adminHeaders()), String.class);
        assertEquals(HttpStatus.NOT_FOUND, r.getStatusCode());
    }
}