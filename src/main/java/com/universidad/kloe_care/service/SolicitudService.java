package com.universidad.kloe_care.service;

import com.universidad.kloe_care.dto.SolicitudesStatsDTO;
import com.universidad.kloe_care.model.EstadoSolicitud;
import com.universidad.kloe_care.model.Solicitud;
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

    /**
     * Crea una nueva solicitud con estado PENDIENTE.
     * El usuario no puede elegir el estado.
     */
    public Solicitud crearSolicitud(UUID solicitanteId, TipoSolicitud tipo, String descripcion) {
        log.info("Creando solicitud de tipo {} para usuario {}", tipo, solicitanteId);

        User solicitante = userRepository.findById(solicitanteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitante no encontrado"));

        Solicitud solicitud = new Solicitud(solicitante, tipo, descripcion);
        Solicitud saved = solicitudRepository.save(solicitud);
        log.info("Solicitud creada con ID: {}", saved.getId());
        return saved;
    }

    /**
     * Obtiene todas las solicitudes del usuario actual.
     */
    public List<Solicitud> obtenerMisSolicitudes(UUID solicitanteId) {
        User solicitante = userRepository.findById(solicitanteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return solicitudRepository.findBySolicitanteOrderByFechaCreacionDesc(solicitante);
    }

    /**
     * Obtiene todas las solicitudes del sistema (solo ADMIN).
     */
    public List<Solicitud> obtenerTodasLasSolicitudes() {
        return solicitudRepository.findAll();
    }

    /**
     * Aprueba una solicitud (solo ADMIN).
     * Cambia estado a APROBADA y establece fechaResolucion.
     */
    public Solicitud aprobarSolicitud(UUID solicitudId, String observacion) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        if (!solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cambiar el estado de una solicitud que no está PENDIENTE"
            );
        }

        solicitud.setEstado(EstadoSolicitud.APROBADA);
        solicitud.setObservacion(observacion);
        solicitud.setFechaResolucion(LocalDateTime.now());
        Solicitud updated = solicitudRepository.save(solicitud);
        log.info("Solicitud {} aprobada", solicitudId);
        return updated;
    }

    /**
     * Rechaza una solicitud (solo ADMIN).
     * Cambia estado a RECHAZADA y establece fechaResolucion.
     */
    public Solicitud rechazarSolicitud(UUID solicitudId, String observacion) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        if (!solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cambiar el estado de una solicitud que no está PENDIENTE"
            );
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitud.setObservacion(observacion);
        solicitud.setFechaResolucion(LocalDateTime.now());
        Solicitud updated = solicitudRepository.save(solicitud);
        log.info("Solicitud {} rechazada", solicitudId);
        return updated;
    }

    /**
     * Obtiene estadísticas de todas las solicitudes.
     * Retorna DTO con contadores por estado y lista completa.
     */
    public SolicitudesStatsDTO obtenerEstadisticas() {
        List<Solicitud> todas = solicitudRepository.findAll();
        return new SolicitudesStatsDTO(todas);
    }
}
