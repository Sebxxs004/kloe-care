package com.universidad.kloe_care;

import com.universidad.kloe_care.repository.MessageRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.universidad.kloe_care.model.User;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de integración para el módulo de mensajes internos.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MessageIntegrationTest {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @LocalServerPort
    private int port;

    private User user1;
    private User user2;
    private String user1Email;
    private String user2Email;

    @BeforeEach
    void setUp() {
        // Limpiar la base de datos antes de cada prueba
        messageRepository.deleteAll();
        userRepository.deleteAll();

        // Crear dos usuarios para las pruebas
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        user1Email = "user1@test.com";
        user1 = new User(
                "User One",
                user1Email,
                encoder.encode("password123"),
                "1234567890"
        );

        user2Email = "user2@test.com";
        user2 = new User(
                "User Two",
                user2Email,
                encoder.encode("password123"),
                "0987654321"
        );

        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
    }

    @Test
    void sendMessageFlow() {
        // Enviar un mensaje de user1 a user2
        String messageJson = "{"
                + "\"receiverUsername\":\"" + user2Email + "\","
                + "\"subject\":\"Test Subject\","
                + "\"content\":\"This is a test message\""
                + "}";

        ResponseEntity<String> sendResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes",
                HttpMethod.POST,
                jsonEntity(messageJson, user1Email),
                String.class);

        assertThat(sendResponse.getStatusCode().value()).isEqualTo(201);
        assertThat(sendResponse.getBody()).contains("Test Subject");
        assertThat(sendResponse.getBody()).contains("This is a test message");
        
        String messageId = extractId(sendResponse.getBody());

        // Verificar que user2 recibe el mensaje en la bandeja de entrada
        ResponseEntity<String> inboxResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/bandeja-entrada",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(inboxResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(inboxResponse.getBody()).contains("Test Subject");
        assertThat(inboxResponse.getBody()).contains("\"isRead\":false");

        // Verificar que user1 ve el mensaje en mensajes enviados
        ResponseEntity<String> sentResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/enviados",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user1Email)),
                String.class);

        assertThat(sentResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(sentResponse.getBody()).contains("Test Subject");

        // Marcar el mensaje como leído
        ResponseEntity<String> markReadResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/" + messageId + "/leer",
                HttpMethod.PUT,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(markReadResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(markReadResponse.getBody()).contains("\"isRead\":true");

        // Verificar que el contador de no leídos es 0
        ResponseEntity<String> unreadResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/no-leidos-count",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(unreadResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(unreadResponse.getBody()).contains("\"count\":0");
    }

    @Test
    void sendMultipleMessagesAndCountUnread() {
        // Enviar 3 mensajes a user2
        for (int i = 1; i <= 3; i++) {
            String messageJson = "{"
                    + "\"receiverUsername\":\"" + user2Email + "\","
                    + "\"subject\":\"Subject " + i + "\","
                    + "\"content\":\"Message content " + i + "\""
                    + "}";

            ResponseEntity<String> sendResponse = restTemplate.exchange(
                    baseUrl() + "/api/mensajes",
                    HttpMethod.POST,
                    jsonEntity(messageJson, user1Email),
                    String.class);

            assertThat(sendResponse.getStatusCode().value()).isEqualTo(201);
        }

        // Verificar que el contador de no leídos es 3
        ResponseEntity<String> unreadResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/no-leidos-count",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(unreadResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(unreadResponse.getBody()).contains("\"count\":3");

        // Obtener la bandeja de entrada y marcar el primero como leído
        ResponseEntity<String> inboxResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes/bandeja-entrada",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(inboxResponse.getStatusCode().value()).isEqualTo(200);
        String messageId = extractId(inboxResponse.getBody());

        restTemplate.exchange(
                baseUrl() + "/api/mensajes/" + messageId + "/leer",
                HttpMethod.PUT,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        // Verificar que el contador de no leídos es 2
        ResponseEntity<String> unreadResponse2 = restTemplate.exchange(
                baseUrl() + "/api/mensajes/no-leidos-count",
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(user2Email)),
                String.class);

        assertThat(unreadResponse2.getStatusCode().value()).isEqualTo(200);
        assertThat(unreadResponse2.getBody()).contains("\"count\":2");
    }

    @Test
    void cannotSendMessageToNonExistentUser() {
        String messageJson = "{"
                + "\"receiverUsername\":\"nonexistent@test.com\","
                + "\"subject\":\"Test\","
                + "\"content\":\"Content\""
                + "}";

        try {
            restTemplate.exchange(
                    baseUrl() + "/api/mensajes",
                    HttpMethod.POST,
                    jsonEntity(messageJson, user1Email),
                    String.class);
            // Si llegamos aquí, la prueba falla
            throw new AssertionError("Se esperaba una excepción 404");
        } catch (HttpClientErrorException ex) {
            assertThat(ex.getStatusCode().value()).isEqualTo(404);
        }
    }

    @Test
    void cannotMarkOtherUserMessage() {
        // user1 envía a user2
        String messageJson = "{"
                + "\"receiverUsername\":\"" + user2Email + "\","
                + "\"subject\":\"Test\","
                + "\"content\":\"Content\""
                + "}";

        ResponseEntity<String> sendResponse = restTemplate.exchange(
                baseUrl() + "/api/mensajes",
                HttpMethod.POST,
                jsonEntity(messageJson, user1Email),
                String.class);

        String messageId = extractId(sendResponse.getBody());

        // user1 intenta marcar el mensaje como leído (no puede, no es el receptor)
        try {
            restTemplate.exchange(
                    baseUrl() + "/api/mensajes/" + messageId + "/leer",
                    HttpMethod.PUT,
                    new HttpEntity<>(jsonHeaders(user1Email)),
                    String.class);
            // Si llegamos aquí, la prueba falla
            throw new AssertionError("Se esperaba una excepción 403");
        } catch (HttpClientErrorException ex) {
            assertThat(ex.getStatusCode().value()).isEqualTo(403);
        }
    }

    @Test
    void markNonExistentMessageAsRead() {
        try {
            restTemplate.exchange(
                    baseUrl() + "/api/mensajes/00000000-0000-0000-0000-000000000000/leer",
                    HttpMethod.PUT,
                    new HttpEntity<>(jsonHeaders(user1Email)),
                    String.class);
            // Si llegamos aquí, la prueba falla
            throw new AssertionError("Se esperaba una excepción 404");
        } catch (HttpClientErrorException ex) {
            assertThat(ex.getStatusCode().value()).isEqualTo(404);
        }
    }

    @Test
    void invalidMessageData() {
        // Asunto vacío
        String messageJson = "{"
                + "\"receiverUsername\":\"" + user2Email + "\","
                + "\"subject\":\"\","
                + "\"content\":\"Content\""
                + "}";

        try {
            restTemplate.exchange(
                    baseUrl() + "/api/mensajes",
                    HttpMethod.POST,
                    jsonEntity(messageJson, user1Email),
                    String.class);
            // Si llegamos aquí, la prueba falla
            throw new AssertionError("Se esperaba una excepción 400");
        } catch (HttpClientErrorException ex) {
            assertThat(ex.getStatusCode().value()).isEqualTo(400);
        }
    }

    private HttpEntity<String> jsonEntity(String body, String userEmail) {
        HttpHeaders headers = jsonHeaders(userEmail);
        return new HttpEntity<>(body, headers);
    }

    private HttpHeaders jsonHeaders(String userEmail) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-Email", userEmail);
        return headers;
    }

    private String extractId(String body) {
        String marker = "\"id\":\"";
        int start = body.indexOf(marker);
        if (start == -1) return "";
        int end = body.indexOf('"', start + marker.length());
        return body.substring(start + marker.length(), end);
    }

    private String baseUrl() {
        return "http://localhost:" + port;
    }
}
