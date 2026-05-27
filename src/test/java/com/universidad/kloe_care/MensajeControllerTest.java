package com.universidad.kloe_care;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.universidad.kloe_care.controller.MensajeController;
import com.universidad.kloe_care.dto.CrearMensajeRequest;
import com.universidad.kloe_care.model.Mensaje;
import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.service.MensajeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockbean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias para MensajeController usando @WebMvcTest.
 * 
 * Cubre 3 casos de prueba:
 * 1. GET /api/mensajes/bandeja-entrada con autenticación → 200 OK
 * 2. GET /api/mensajes/bandeja-entrada sin autenticación → 400 Bad Request
 * 3. POST /api/mensajes con cuerpo vacío → 400 Bad Request
 */
@WebMvcTest(MensajeController.class)
@DisplayName("MensajeController Tests")
class MensajeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MensajeService mensajeService;

    private UUID userId;
    private UUID receptorId;
    private List<Mensaje> mockMensajes;
    private User emisor;
    private User receptor;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        receptorId = UUID.randomUUID();

        // Mock usuarios
        emisor = new User("Juan Pérez", "juan@example.com", "password123", "+34600000000");
        emisor.setId(userId);

        receptor = new User("María López", "maria@example.com", "password123", "+34600000001");
        receptor.setId(receptorId);

        // Mock mensajes
        mockMensajes = new ArrayList<>();
        Mensaje msg1 = new Mensaje(emisor, receptor, "Asunto 1", "Contenido 1");
        msg1.setId(UUID.randomUUID());
        mockMensajes.add(msg1);

        Mensaje msg2 = new Mensaje(emisor, receptor, "Asunto 2", "Contenido 2");
        msg2.setId(UUID.randomUUID());
        mockMensajes.add(msg2);
    }

    /**
     * Prueba 1: GET /api/mensajes/bandeja-entrada CON autenticación
     * Debe retornar 200 OK con lista de mensajes
     */
    @Test
    @DisplayName("TEST 1: GET /api/mensajes/bandeja-entrada con X-User-Id → 200 OK")
    void testObtenerBandejaEntradaConAutenticacion() throws Exception {
        // Arrange
        when(mensajeService.obtenerBandejaEntrada(userId))
                .thenReturn(mockMensajes);

        // Act & Assert
        mockMvc.perform(get("/api/mensajes/bandeja-entrada")
                .header("X-User-Id", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].asunto").value("Asunto 1"))
                .andExpect(jsonPath("$[1].asunto").value("Asunto 2"));
    }

    /**
     * Prueba 2: GET /api/mensajes/bandeja-entrada SIN autenticación
     * Debe retornar 400 Bad Request (falta header X-User-Id obligatorio)
     */
    @Test
    @DisplayName("TEST 2: GET /api/mensajes/bandeja-entrada sin X-User-Id → 400 Bad Request")
    void testObtenerBandejaEntradaSinAutenticacion() throws Exception {
        // Act & Assert
        // Sin header X-User-Id, Spring retorna 400 porque falta parámetro obligatorio
        mockMvc.perform(get("/api/mensajes/bandeja-entrada")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    /**
     * Prueba 3: POST /api/mensajes con cuerpo vacío
     * Debe retornar 400 Bad Request debido a validación @NotNull/@NotBlank
     */
    @Test
    @DisplayName("TEST 3: POST /api/mensajes con cuerpo vacío → 400 Bad Request")
    void testCrearMensajeConCuerpoVacio() throws Exception {
        // Act & Assert - Cuerpo JSON con objeto vacío
        mockMvc.perform(post("/api/mensajes")
                .header("X-User-Id", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    /**
     * Prueba bonus: POST /api/mensajes con campos faltantes
     * Debe retornar 400 Bad Request
     */
    @Test
    @DisplayName("BONUS: POST /api/mensajes con campos faltantes → 400 Bad Request")
    void testCrearMensajeConCamposFaltantes() throws Exception {
        // Cuerpo sin 'contenido' (campo requerido)
        CrearMensajeRequest requestIncompleto = new CrearMensajeRequest(
                receptorId,
                "Asunto",
                null // contenido nulo - falta
        );

        // Act & Assert
        mockMvc.perform(post("/api/mensajes")
                .header("X-User-Id", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestIncompleto)))
                .andExpect(status().isBadRequest());
    }

    /**
     * Prueba bonus: POST /api/mensajes sin header X-User-Id
     * Debe retornar 400 Bad Request
     */
    @Test
    @DisplayName("BONUS: POST /api/mensajes sin X-User-Id → 400 Bad Request")
    void testCrearMensajeSinAutenticacion() throws Exception {
        CrearMensajeRequest request = new CrearMensajeRequest(
                receptorId,
                "Asunto",
                "Contenido válido"
        );

        // Act & Assert
        mockMvc.perform(post("/api/mensajes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
