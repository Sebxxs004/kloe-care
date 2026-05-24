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
class FeedingIntegrationTest {

    private final RestTemplate restTemplate = new RestTemplate();

    @LocalServerPort
    private int port;

    @Test
    void createUpdateDeleteFeedingRecord() {
        String feedingJson = "{\"foodType\":\"Dry\",\"amount\":200.0,\"schedule\":\"08:00\",\"frequency\":2,\"nutritionalObservations\":\"No issues\"}";

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl() + "/api/feedings",
                HttpMethod.POST,
                jsonEntity(feedingJson),
                String.class);

        assertThat(createResponse.getStatusCode().value()).isEqualTo(201);
        assertThat(createResponse.getBody()).contains("\"foodType\":\"Dry\"");
        String feedingId = extractId(createResponse.getBody());

        String updateJson = "{\"foodType\":\"Wet\",\"amount\":180.0,\"schedule\":\"09:00\",\"frequency\":3,\"nutritionalObservations\":\"Better appetite\"}";
        ResponseEntity<String> updateResponse = restTemplate.exchange(
                baseUrl() + "/api/feedings/" + feedingId,
                HttpMethod.PUT,
                jsonEntity(updateJson),
                String.class);

        assertThat(updateResponse.getStatusCode().value()).isEqualTo(200);

        ResponseEntity<String> deleteResponse = restTemplate.exchange(
                baseUrl() + "/api/feedings/" + feedingId,
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
