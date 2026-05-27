package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Solicitud;
import com.universidad.kloe_care.model.SolicitudEstado;
import com.universidad.kloe_care.model.TipoSolicitud;
import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.SolicitudRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SolicitudService {

    private static final Logger log = LoggerFactory.getLogger(SolicitudService.class);

    private final SolicitudRepository solicitudRepository;
    private final UserRepository userRepository;

    public SolicitudService(SolicitudRepository solicitudRepository, UserRepository userRepository) {
        this.solicitudRepository = solicitudRepository;
        this.userRepository = userRepository;
    }

    private User resolveUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
    }

    public Solicitud crearSolicitud(String userEmail, String tipoStr, String descripcion) {
        if (tipoStr == null || tipoStr.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de solicitud es obligatorio");
        }
        if (descripcion == null || descripcion.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripcion es obligatoria");
        }

        TipoSolicitud tipo;
        try {
            tipo = TipoSolicitud.valueOf(tipoStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo invalido. Valores permitidos: SOPORTE, ACCESO, INFORMACION");
        }

        User solicitante = resolveUser(userEmail);
        Solicitud solicitud = new Solicitud(solicitante, tipo, descripcion.trim());
        solicitudRepository.save(solicitud);
        log.info("Solicitud creada con id={} por {}", solicitud.getId(), userEmail);
        return solicitud;
    }

    public List<Solicitud> getMisSolicitudes(String userEmail) {
        User user = resolveUser(userEmail);
        return solicitudRepository.findBySolicitante(user);
    }

    public List<Solicitud> getAllSolicitudes() {
        return solicitudRepository.findAll();
    }

    public Solicitud aprobar(UUID id, String observacion) {
        if (observacion == null || observacion.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La observacion es obligatoria");
        }
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        solicitud.setEstado(SolicitudEstado.APROBADA);
        solicitud.setObservacion(observacion.trim());
        solicitud.setFechaResolucion(LocalDateTime.now());
        solicitudRepository.save(solicitud);
        log.info("Solicitud {} aprobada", id);
        return solicitud;
    }

    public Solicitud rechazar(UUID id, String observacion) {
        if (observacion == null || observacion.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La observacion es obligatoria");
        }
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        solicitud.setEstado(SolicitudEstado.RECHAZADA);
        solicitud.setObservacion(observacion.trim());
        solicitud.setFechaResolucion(LocalDateTime.now());
        solicitudRepository.save(solicitud);
        log.info("Solicitud {} rechazada", id);
        return solicitud;
    }
}