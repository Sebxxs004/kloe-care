package com.universidad.kloe_care;

import com.universidad.kloe_care.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserIntegrationTest {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private UserRepository userRepository;

    @LocalServerPort
    private int port;

    @Test
    void registerAndLoginFlow() {
        String userJson = "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}";

        ResponseEntity<String> registerResponse = restTemplate.exchange(
                baseUrl() + "/api/users",
                HttpMethod.POST,
                jsonEntity(userJson),
                String.class);

        assertThat(registerResponse.getStatusCode().value()).isEqualTo(201);
        assertThat(registerResponse.getBody()).contains("\"email\":\"test@example.com\"");
        assertThat(registerResponse.getBody()).doesNotContain("\"password\":\"password123\"");

        String storedPassword = userRepository.findByEmail("test@example.com")
                .orElseThrow()
                .getPassword();
        assertThat(storedPassword).isNotEqualTo("password123");

        String loginJson = "{\"email\":\"test@example.com\",\"password\":\"password123\"}";
        ResponseEntity<String> loginResponse = restTemplate.exchange(
                baseUrl() + "/auth/login",
                HttpMethod.POST,
                jsonEntity(loginJson),
                String.class);

        assertThat(loginResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(loginResponse.getBody()).contains("Login exitoso");
    }

    private HttpEntity<String> jsonEntity(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    private String baseUrl() {
        return "http://localhost:" + port;
    }
}
