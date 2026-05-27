package com.universidad.kloe_care;

import com.universidad.kloe_care.controller.AuthExceptionHandler;
import com.universidad.kloe_care.controller.MessageController;
import com.universidad.kloe_care.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class MensajeControllerTest {

    @Mock
    private MessageService messageService;

    @InjectMocks
    private MessageController messageController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(messageController)
                .setControllerAdvice(new AuthExceptionHandler())
                .build();
    }

    /** Prueba 1: GET con autenticación → 200 */
    @Test
    void getBandejaEntrada_conAutenticacion_retorna200() throws Exception {
        when(messageService.getInbox(anyString())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/mensajes/bandeja-entrada")
                        .header("X-User-Email", "usuario@test.com"))
                .andExpect(status().isOk());
    }

    /** Prueba 2: GET sin autenticación → 401 */
    @Test
    void getBandejaEntrada_sinAutenticacion_retorna401() throws Exception {
        mockMvc.perform(get("/api/mensajes/bandeja-entrada"))
                .andExpect(status().isUnauthorized());
    }

    /** Prueba 3: POST con cuerpo vacío → 400 */
    @Test
    void postMensaje_camposObligatoriosFaltantes_retorna400() throws Exception {
        mockMvc.perform(post("/api/mensajes")
                        .header("X-User-Email", "usuario@test.com")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}