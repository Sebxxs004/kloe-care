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
class PetIntegrationTest {

    private final RestTemplate restTemplate = new RestTemplate();

    @LocalServerPort
    private int port;

    @Test
    void createUpdateDeletePetFlow() {
        String petJson = "{\"name\":\"Firulais\",\"species\":\"Perro\",\"breed\":\"Mestizo\",\"age\":3,\"weight\":12.5,\"sex\":\"Macho\",\"birthDate\":\"2021-05-10\"}";

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl() + "/api/pets",
                HttpMethod.POST,
                jsonEntity(petJson),
                String.class);

        assertThat(createResponse.getStatusCode().value()).isEqualTo(201);
        assertThat(createResponse.getBody()).contains("\"name\":\"Firulais\"");
        String petId = extractId(createResponse.getBody());

        String updateJson = "{\"name\":\"Firulais\",\"species\":\"Perro\",\"breed\":\"Labrador Mix\",\"age\":4,\"weight\":13.0,\"sex\":\"Macho\",\"birthDate\":\"2021-05-10\"}";
        ResponseEntity<String> updateResponse = restTemplate.exchange(
                baseUrl() + "/api/pets/" + petId,
                HttpMethod.PUT,
                jsonEntity(updateJson),
                String.class);

        assertThat(updateResponse.getStatusCode().value()).isEqualTo(200);

        ResponseEntity<String> getResponse = restTemplate.getForEntity(baseUrl() + "/api/pets/" + petId, String.class);
        assertThat(getResponse.getStatusCode().value()).isEqualTo(200);
        assertThat(getResponse.getBody()).contains("\"breed\":\"Labrador Mix\"");
        assertThat(getResponse.getBody()).contains("\"age\":4");

        ResponseEntity<String> deleteResponse = restTemplate.exchange(
                baseUrl() + "/api/pets/" + petId,
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
