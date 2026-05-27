package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.CrearMensajeRequest;
import com.universidad.kloe_care.model.Mensaje;
import com.universidad.kloe_care.service.MensajeService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controlador que expone los endpoints del sistema de mensajería interna.
 * Requiere autenticación via header X-User-Id (UUID del usuario actual).
 */
@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private static final Logger log = LoggerFactory.getLogger(MensajeController.class);
    private static final String USER_ID_HEADER = "X-User-Id";

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    /**
     * POST /api/mensajes
     * Crea un nuevo mensaje.
     * Requiere header X-User-Id (UUID del emisor).
     * Body: { "receptorId": "uuid", "asunto": "...", "contenido": "..." }
     * Retorna 201 Created con el mensaje creado.
     */
    @PostMapping
    public ResponseEntity<Mensaje> crearMensaje(
            @RequestHeader(USER_ID_HEADER) UUID emisorId,
            @Valid @RequestBody CrearMensajeRequest request) {
        log.info("Creando mensaje desde {} a {}", emisorId, request.getReceptorId());
        Mensaje mensaje = mensajeService.crearMensaje(
                emisorId,
                request.getReceptorId(),
                request.getAsunto(),
                request.getContenido()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
    }

    /**
     * GET /api/mensajes/bandeja-entrada
     * Retorna los mensajes recibidos por el usuario actual.
     * Requiere header X-User-Id.
     */
    @GetMapping("/bandeja-entrada")
    public ResponseEntity<List<Mensaje>> obtenerBandejaEntrada(
            @RequestHeader(USER_ID_HEADER) UUID usuarioId) {
        log.info("Obteniendo bandeja entrada para usuario {}", usuarioId);
        List<Mensaje> mensajes = mensajeService.obtenerBandejaEntrada(usuarioId);
        return ResponseEntity.ok(mensajes);
    }

    /**
     * GET /api/mensajes/enviados
     * Retorna los mensajes enviados por el usuario actual.
     * Requiere header X-User-Id.
     */
    @GetMapping("/enviados")
    public ResponseEntity<List<Mensaje>> obtenerEnviados(
            @RequestHeader(USER_ID_HEADER) UUID usuarioId) {
        log.info("Obteniendo mensajes enviados por usuario {}", usuarioId);
        List<Mensaje> mensajes = mensajeService.obtenerEnviados(usuarioId);
        return ResponseEntity.ok(mensajes);
    }

    /**
     * PUT /api/mensajes/{id}/leer
     * Marca un mensaje como leído.
     * Solo el receptor puede marcar un mensaje como leído.
     * Requiere header X-User-Id.
     * Retorna 200 OK o 404 Not Found.
     */
    @PutMapping("/{id}/leer")
    public ResponseEntity<Mensaje> marcarComoLeido(
            @PathVariable UUID id,
            @RequestHeader(USER_ID_HEADER) UUID usuarioId) {
        log.info("Marcando mensaje {} como leído por usuario {}", id, usuarioId);
        Mensaje mensaje = mensajeService.marcarComoLeido(id, usuarioId);
        return ResponseEntity.ok(mensaje);
    }

    /**
     * GET /api/mensajes/no-leidos/count
     * Retorna la cantidad de mensajes no leídos.
     * Requiere header X-User-Id.
     * Retorna JSON: { "count": N }
     */
    @GetMapping("/no-leidos/count")
    public ResponseEntity<Map<String, Long>> obtenerCountNoLeidos(
            @RequestHeader(USER_ID_HEADER) UUID usuarioId) {
        log.info("Obteniendo count de no leídos para usuario {}", usuarioId);
        long count = mensajeService.obtenerCountNoLeidos(usuarioId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

}
