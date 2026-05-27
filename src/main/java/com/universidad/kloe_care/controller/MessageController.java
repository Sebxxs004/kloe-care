package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.SendMessageRequest;
import com.universidad.kloe_care.dto.UnreadCountResponse;
import com.universidad.kloe_care.model.Message;
import com.universidad.kloe_care.service.MessageService;
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

import java.util.List;
import java.util.UUID;

/**
 * Controlador que expone los endpoints de la API de mensajes internos.
 * Requiere autenticación mediante el header X-User-Email.
 */
@RestController
@RequestMapping("/api/mensajes")
public class MessageController {

    private static final Logger log = LoggerFactory.getLogger(MessageController.class);
    private static final String USER_EMAIL_HEADER = "X-User-Email";

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * GET /api/mensajes/bandeja-entrada
     * Lista todos los mensajes recibidos por el usuario autenticado.
     * 
     * @return 200 OK con lista de mensajes
     *         401 Unauthorized si el usuario no está autenticado
     */
    @GetMapping("/bandeja-entrada")
    public ResponseEntity<List<Message>> getInbox(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail) {
        log.info("GET /api/mensajes/bandeja-entrada - Obteniendo inbox de {}", userEmail);

        try {
            List<Message> messages = messageService.getInbox(userEmail);
            return ResponseEntity.ok(messages);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            throw ex;
        }
    }

    /**
     * GET /api/mensajes/enviados
     * Lista todos los mensajes enviados por el usuario autenticado.
     * 
     * @return 200 OK con lista de mensajes
     *         401 Unauthorized si el usuario no está autenticado
     */
    @GetMapping("/enviados")
    public ResponseEntity<List<Message>> getSentMessages(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail) {
        log.info("GET /api/mensajes/enviados - Obteniendo mensajes enviados de {}", userEmail);

        try {
            List<Message> messages = messageService.getSentMessages(userEmail);
            return ResponseEntity.ok(messages);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            throw ex;
        }
    }

    /**
     * GET /api/mensajes/no-leidos-count
     * Retorna el número de mensajes no leídos del usuario autenticado.
     * 
     * @return 200 OK con JSON: {"count": N}
     *         401 Unauthorized si el usuario no está autenticado
     */
    @GetMapping("/no-leidos-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail) {
        log.info("GET /api/mensajes/no-leidos-count - Obteniendo contador de no leídos para {}", userEmail);

        try {
            long count = messageService.getUnreadCount(userEmail);
            return ResponseEntity.ok(new UnreadCountResponse(count));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            throw ex;
        }
    }

    /**
     * POST /api/mensajes
     * Crea y persiste un nuevo mensaje.
     * Requiere: X-User-Email header (del usuario autenticado)
     * 
     * @return 201 Created si el mensaje se crea exitosamente
     *         400 Bad Request si hay datos inválidos
     *         401 Unauthorized si el usuario no está autenticado
     *         404 Not Found si el usuario destinatario no existe
     */
    @PostMapping
    public ResponseEntity<Message> createMessage(
            @RequestHeader(USER_EMAIL_HEADER) String userEmail,
            @RequestBody SendMessageRequest request) {
        log.info("POST /api/mensajes - Creando mensaje de {}", userEmail);

        if (request.getReceiverUsername() == null || request.getReceiverUsername().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Message message = messageService.sendMessage(
                    userEmail,
                    request.getReceiverUsername(),
                    request.getSubject(),
                    request.getContent()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            throw ex;
        }
    }

    /**
     * PUT /api/mensajes/{id}/leer
     * Marca un mensaje recibido como leído.
     * Solo el receptor puede marcar como leído.
     * 
     * @return 200 OK si el mensaje se marca exitosamente
     *         404 Not Found si el mensaje no existe
     *         401 Unauthorized si el usuario no está autenticado
     *         403 Forbidden si el usuario no es el receptor del mensaje
     */
    @PutMapping("/{id}/leer")
    public ResponseEntity<Message> markAsRead(
            @PathVariable UUID id,
            @RequestHeader(USER_EMAIL_HEADER) String userEmail) {
        log.info("PUT /api/mensajes/{}/leer - Marcando como leído por {}", id, userEmail);

        try {
            Message message = messageService.markAsRead(id, userEmail);
            return ResponseEntity.ok(message);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            throw ex;
        }
    }
}
