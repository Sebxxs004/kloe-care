package com.universidad.kloe_care;

import org.junit.jupiter.api.Test;
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
class HealthIntegrationTest {

    private final RestTemplate restTemplate = new RestTemplate();

    @LocalServerPort
    private int port;

    @Test
    void createUpdateDeleteHealthRecord() {
        String healthJson = "{\"temperature\":38.5,\"generalState\":\"Estable\",\"recordDate\":\"2026-05-24\",\"symptoms\":[\"cough\"],\"vaccines\":[\"Rabia\"],\"medications\":[\"Antibiotico\"],\"observations\":\"General well\"}";

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl() + "/api/health-records",
                HttpMethod.POST,
                jsonEntity(healthJson),
                String.class);

        assertThat(createResponse.getStatusCode().value()).isEqualTo(201);
        assertThat(createResponse.getBody()).contains("\"generalState\":\"Estable\"");
        String healthId = extractId(createResponse.getBody());

        String updateJson = "{\"temperature\":39.1,\"generalState\":\"Con observación\",\"recordDate\":\"2026-05-24\",\"symptoms\":[\"cough\",\"sneeze\"],\"vaccines\":[\"Rabia\"],\"medications\":[\"Antibiotico\"],\"observations\":\"Needs follow up\"}";
        ResponseEntity<String> updateResponse = restTemplate.exchange(
                baseUrl() + "/api/health-records/" + healthId,
                HttpMethod.PUT,
                jsonEntity(updateJson),
                String.class);

        assertThat(updateResponse.getStatusCode().value()).isEqualTo(200);

        ResponseEntity<String> deleteResponse = restTemplate.exchange(
                baseUrl() + "/api/health-records/" + healthId,
                HttpMethod.DELETE,
                HttpEntity.EMPTY,
                String.class);

        assertThat(deleteResponse.getStatusCode().value()).isEqualTo(204);
    }

    private HttpEntity<String> jsonEntity(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    private String extractId(String body) {
        String marker = "\"id\":\"";
        int start = body.indexOf(marker);
        int end = body.indexOf('"', start + marker.length());
        return body.substring(start + marker.length(), end);
    }

    private String baseUrl() {
        return "http://localhost:" + port;
    }
}
