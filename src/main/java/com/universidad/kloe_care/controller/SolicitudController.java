package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.CrearSolicitudRequest;
import com.universidad.kloe_care.model.Solicitud;
import com.universidad.kloe_care.service.SolicitudService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private static final Logger log = LoggerFactory.getLogger(SolicitudController.class);
    private static final String USER_EMAIL_HEADER = "X-User-Email";
    private static final String USER_ROLE_HEADER = "X-User-Role";
    private static final String ADMIN_ROLE = "ADMIN";

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    private void requireAdmin(String role) {
        if (role == null || !ADMIN_ROLE.equalsIgnoreCase(role.trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso restringido a administradores");
        }
    }

    /** POST /api/solicitudes - Crea una nueva solicitud. Retorna 201 */
    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail,
            @RequestBody CrearSolicitudRequest request) {
        log.info("POST /api/solicitudes - usuario={}", userEmail);
        Solicitud solicitud = solicitudService.crearSolicitud(
                userEmail, request.getTipo(), request.getDescripcion());
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitud);
    }

    /** GET /api/solicitudes/mis-solicitudes - Lista solicitudes del usuario actual */
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<Solicitud>> getMisSolicitudes(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail) {
        log.info("GET /api/solicitudes/mis-solicitudes - usuario={}", userEmail);
        return ResponseEntity.ok(solicitudService.getMisSolicitudes(userEmail));
    }

    /** GET /api/solicitudes - Lista todas las solicitudes (solo ADMIN) */
    @GetMapping
    public ResponseEntity<List<Solicitud>> getAllSolicitudes(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail,
            @RequestHeader(USER_ROLE_HEADER) String userRole) {
        log.info("GET /api/solicitudes - usuario={}", userEmail);
        requireAdmin(userRole);
        return ResponseEntity.ok(solicitudService.getAllSolicitudes());
    }

    /** PUT /api/solicitudes/{id}/aprobar - Aprueba una solicitud (solo ADMIN) */
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<Solicitud> aprobar(
            @PathVariable UUID id,
            @RequestParam String observacion,
            @RequestHeader(USER_EMAIL_HEADER) String userEmail,
            @RequestHeader(USER_ROLE_HEADER) String userRole) {
        log.info("PUT /api/solicitudes/{}/aprobar - admin={}", id, userEmail);
        requireAdmin(userRole);
        return ResponseEntity.ok(solicitudService.aprobar(id, observacion));
    }

    /** PUT /api/solicitudes/{id}/rechazar - Rechaza una solicitud (solo ADMIN) */
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Solicitud> rechazar(
            @PathVariable UUID id,
            @RequestParam String observacion,
            @RequestHeader(USER_EMAIL_HEADER) String userEmail,
            @RequestHeader(USER_ROLE_HEADER) String userRole) {
        log.info("PUT /api/solicitudes/{}/rechazar - admin={}", id, userEmail);
        requireAdmin(userRole);
        return ResponseEntity.ok(solicitudService.rechazar(id, observacion));
    }
}