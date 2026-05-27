package com.universidad.kloe_care;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.universidad.kloe_care.dto.CrearSolicitudRequest;
import com.universidad.kloe_care.model.Solicitud;
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
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SolicitudIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String USER_EMAIL = "solicitante@test.com";
    private static final String ADMIN_EMAIL = "admin@test.com";

    @BeforeEach
    void setUp() {
        solicitudRepository.deleteAll();
        userRepository.deleteAll();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        User user = new User("Solicitante Test", USER_EMAIL,
                encoder.encode("password123"), "3001234567");
        userRepository.save(user);

        User admin = new User("Admin Test", ADMIN_EMAIL,
                encoder.encode("password123"), "3007654321");
        userRepository.save(admin);
    }

    @Test
    void crearSolicitud_retorna201() throws Exception {
        CrearSolicitudRequest req = new CrearSolicitudRequest();
        req.setTipo("SOPORTE");
        req.setDescripcion("Necesito soporte tecnico con el sistema");

        mockMvc.perform(post("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.tipo").value("SOPORTE"));
    }

    @Test
    void getMisSolicitudes_retorna200() throws Exception {
        // Crear una solicitud primero
        CrearSolicitudRequest req = new CrearSolicitudRequest();
        req.setTipo("ACCESO");
        req.setDescripcion("Solicito acceso al modulo de reportes");

        mockMvc.perform(post("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/solicitudes/mis-solicitudes")
                        .header("X-User-Email", USER_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getAllSolicitudes_admin_retorna200() throws Exception {
        mockMvc.perform(get("/api/solicitudes")
                        .header("X-User-Email", ADMIN_EMAIL)
                        .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllSolicitudes_sinAdmin_retorna403() throws Exception {
        mockMvc.perform(get("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .header("X-User-Role", "USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void aprobarSolicitud_retorna200() throws Exception {
        // Crear solicitud
        CrearSolicitudRequest req = new CrearSolicitudRequest();
        req.setTipo("INFORMACION");
        req.setDescripcion("Solicito informacion sobre el servicio");

        MvcResult result = mockMvc.perform(post("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Solicitud created = objectMapper.readValue(
                result.getResponse().getContentAsString(), Solicitud.class);

        mockMvc.perform(put("/api/solicitudes/" + created.getId() + "/aprobar")
                        .header("X-User-Email", ADMIN_EMAIL)
                        .header("X-User-Role", "ADMIN")
                        .param("observacion", "Solicitud aprobada correctamente"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("APROBADA"))
                .andExpect(jsonPath("$.observacion").value("Solicitud aprobada correctamente"));
    }

    @Test
    void rechazarSolicitud_retorna200() throws Exception {
        CrearSolicitudRequest req = new CrearSolicitudRequest();
        req.setTipo("SOPORTE");
        req.setDescripcion("Solicitud de prueba para rechazar");

        MvcResult result = mockMvc.perform(post("/api/solicitudes")
                        .header("X-User-Email", USER_EMAIL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Solicitud created = objectMapper.readValue(
                result.getResponse().getContentAsString(), Solicitud.class);

        mockMvc.perform(put("/api/solicitudes/" + created.getId() + "/rechazar")
                        .header("X-User-Email", ADMIN_EMAIL)
                        .header("X-User-Role", "ADMIN")
                        .param("observacion", "No cumple los requisitos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("RECHAZADA"));
    }

    @Test
    void aprobarSolicitud_noExiste_retorna404() throws Exception {
        mockMvc.perform(put("/api/solicitudes/00000000-0000-0000-0000-000000000000/aprobar")
                        .header("X-User-Email", ADMIN_EMAIL)
                        .header("X-User-Role", "ADMIN")
                        .param("observacion", "Test"))
                .andExpect(status().isNotFound());
    }
}