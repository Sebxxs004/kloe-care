package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.CrearSolicitudRequest;
import com.universidad.kloe_care.model.Solicitud;
import com.universidad.kloe_care.service.SolicitudService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Controlador que expone los endpoints del sistema de solicitudes.
 * Requiere autenticación via header X-User-Id.
 * Endpoints de ADMIN requieren header X-Admin: true
 */
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private static final Logger log = LoggerFactory.getLogger(SolicitudController.class);
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String ADMIN_HEADER = "X-Admin";

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    /**
     * POST /api/solicitudes
     * Crea una nueva solicitud con estado PENDIENTE.
     * El usuario no puede elegir el estado.
     * Requiere header X-User-Id.
     * Retorna 201 Created.
     */
    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(
            @RequestHeader(USER_ID_HEADER) UUID solicitanteId,
            @Valid @RequestBody CrearSolicitudRequest request) {
        log.info("Creando solicitud de tipo {} para usuario {}", request.getTipo(), solicitanteId);
        Solicitud solicitud = solicitudService.crearSolicitud(
                solicitanteId,
                request.getTipo(),
                request.getDescripcion()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitud);
    }

    /**
     * GET /api/solicitudes/mis-solicitudes
     * Retorna todas las solicitudes del usuario actual.
     * Requiere header X-User-Id.
     */
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<Solicitud>> obtenerMisSolicitudes(
            @RequestHeader(USER_ID_HEADER) UUID solicitanteId) {
        log.info("Obteniendo solicitudes del usuario {}", solicitanteId);
        List<Solicitud> solicitudes = solicitudService.obtenerMisSolicitudes(solicitanteId);
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * GET /api/solicitudes
     * Retorna todas las solicitudes del sistema.
     * Solo ADMIN puede acceder (requiere header X-Admin: true).
     */
    @GetMapping
    public ResponseEntity<List<Solicitud>> obtenerTodasLasSolicitudes(
            @RequestHeader(value = ADMIN_HEADER, defaultValue = "false") String isAdmin) {
        boolean esAdmin = Boolean.parseBoolean(isAdmin);
        if (!esAdmin) {
            log.warn("Intento de acceso no autorizado a /api/solicitudes");
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo ADMIN puede ver todas las solicitudes"
            );
        }
        log.info("ADMIN obteniendo todas las solicitudes");
        List<Solicitud> solicitudes = solicitudService.obtenerTodasLasSolicitudes();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * PUT /api/solicitudes/{id}/aprobar
     * Aprueba una solicitud (ADMIN only).
     * Query param: observacion (texto para la resolución)
     * Requiere header X-Admin: true.
     * Retorna 200 OK o 404 Not Found.
     */
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<Solicitud> aprobarSolicitud(
            @PathVariable UUID id,
            @RequestParam String observacion,
            @RequestHeader(value = ADMIN_HEADER, defaultValue = "false") String isAdmin) {
        boolean esAdmin = Boolean.parseBoolean(isAdmin);
        if (!esAdmin) {
            log.warn("Intento de aprobación no autorizado para solicitud {}", id);
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo ADMIN puede aprobar solicitudes"
            );
        }
        log.info("ADMIN aprobando solicitud {}", id);
        Solicitud solicitud = solicitudService.aprobarSolicitud(id, observacion);
        return ResponseEntity.ok(solicitud);
    }

    /**
     * PUT /api/solicitudes/{id}/rechazar
     * Rechaza una solicitud (ADMIN only).
     * Query param: observacion (texto para la resolución)
     * Requiere header X-Admin: true.
     * Retorna 200 OK o 404 Not Found.
     */
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Solicitud> rechazarSolicitud(
            @PathVariable UUID id,
            @RequestParam String observacion,
            @RequestHeader(value = ADMIN_HEADER, defaultValue = "false") String isAdmin) {
        boolean esAdmin = Boolean.parseBoolean(isAdmin);
        if (!esAdmin) {
            log.warn("Intento de rechazo no autorizado para solicitud {}", id);
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo ADMIN puede rechazar solicitudes"
            );
        }
        log.info("ADMIN rechazando solicitud {}", id);
        Solicitud solicitud = solicitudService.rechazarSolicitud(id, observacion);
        return ResponseEntity.ok(solicitud);
    }
}
