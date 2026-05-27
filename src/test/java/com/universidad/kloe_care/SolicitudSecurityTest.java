package com.universidad.kloe_care;

import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.SolicitudRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SolicitudSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    private static final String USER_EMAIL = "security@test.com";

    @BeforeEach
    void setUp() {
        solicitudRepository.deleteAll();
        userRepository.deleteAll();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        userRepository.save(new User("Security Test", USER_EMAIL,
                encoder.encode("pass12345"), "3001111111"));
    }

    /**
     * Prueba 1: POST sin ninguna autenticación → 401
     * Sin header X-User-Email el sistema rechaza la petición.
     */
    @Test
    void postSolicitud_sinAutenticacion_retorna401() throws Exception {
        mockMvc.perform(post("/api/solicitudes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tipo\":\"SOPORTE\",\"descripcion\":\"Test sin auth\"}"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Prueba 2: POST con usuario autenticado sin rol especial → 201 Created
     * Usuario válido con X-User-Email puede radicar solicitudes.
     */
    @Test
    void postSolicitud_conUsuarioAutenticado_retorna201() throws Exception {
        mockMvc.perform(post("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tipo\":\"SOPORTE\",\"descripcion\":\"Solicitud de prueba de seguridad\"}"))
                .andExpect(status().isCreated());
    }

    /**
     * Prueba 3: PUT aprobar con rol USER (sin ADMIN) → 403 Forbidden
     * El sistema rechaza ANTES de ejecutar la lógica de negocio.
     * Se acepta que el ID no exista — el 403 debe ocurrir primero.
     */
    @Test
    void aprobarSolicitud_conRolUser_retorna403() throws Exception {
        mockMvc.perform(put("/api/solicitudes/00000000-0000-0000-0000-000000000000/aprobar")
                        .header("X-User-Email", USER_EMAIL)
                        .header("X-User-Role", "USER")
                        .param("observacion", "intento sin permiso"))
                .andExpect(status().isForbidden());
    }
}