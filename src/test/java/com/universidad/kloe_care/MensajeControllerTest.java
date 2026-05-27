package com.universidad.kloe_care;

import com.universidad.kloe_care.controller.AuthExceptionHandler;
import com.universidad.kloe_care.controller.MessageController;
import com.universidad.kloe_care.service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MessageController.class)
@Import(AuthExceptionHandler.class)
public class MensajeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MessageService messageService;

    /** Prueba 1: GET con usuario autenticado → HTTP 200 OK */
    @Test
    void getBandejaEntrada_conAutenticacion_retorna200() throws Exception {
        when(messageService.getInbox(anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/mensajes/bandeja-entrada")
                        .header("X-User-Email", "usuario@test.com"))
                .andExpect(status().isOk());
    }

    /** Prueba 2: GET sin ninguna autenticación → HTTP 401 */
    @Test
    void getBandejaEntrada_sinAutenticacion_retorna401() throws Exception {
        mockMvc.perform(get("/api/mensajes/bandeja-entrada"))
                .andExpect(status().isUnauthorized());
    }

    /** Prueba 3: POST con cuerpo vacío / campos obligatorios faltantes → HTTP 400 */
    @Test
    void postMensaje_camposObligatoriosFaltantes_retorna400() throws Exception {
        mockMvc.perform(post("/api/mensajes")
                        .header("X-User-Email", "usuario@test.com")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}