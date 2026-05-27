package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Message;
import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.MessageRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio que gestiona la lógica de negocio para mensajes internos.
 */
@Service
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    /**
     * Crea y persiste un nuevo mensaje de un usuario a otro.
     *
     * @param senderEmail email del usuario que envía el mensaje
     * @param receiverUsername nombre de usuario del destinatario (email normalizado)
     * @param subject asunto del mensaje
     * @param content contenido del mensaje
     * @return el mensaje creado
     */
    public Message sendMessage(String senderEmail, String receiverUsername, String subject, String content) {
        log.info("Enviando mensaje de {} a {}", senderEmail, receiverUsername);

        if (subject == null || subject.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El asunto es obligatorio");
        }
        if (content == null || content.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El contenido es obligatorio");
        }

        User sender = userRepository.findByEmail(senderEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        User receiver = userRepository.findByEmail(receiverUsername.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario destinatario no encontrado"));

        if (sender.getId().equals(receiver.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes enviar un mensaje a ti mismo");
        }

        Message message = new Message(sender, receiver, subject.trim(), content.trim());
        messageRepository.save(message);

        log.info("Mensaje enviado exitosamente con id={}", message.getId());
        return message;
    }

    /**
     * Obtiene todos los mensajes recibidos por el usuario autenticado (bandeja de entrada).
     */
    public List<Message> getInbox(String userEmail) {
        log.debug("Obteniendo bandeja de entrada para {}", userEmail);

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        return messageRepository.findByReceiver(user);
    }

    /**
     * Obtiene todos los mensajes enviados por el usuario autenticado.
     */
    public List<Message> getSentMessages(String userEmail) {
        log.debug("Obteniendo mensajes enviados para {}", userEmail);

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        return messageRepository.findBySender(user);
    }

    /**
     * Marca un mensaje como leído.
     * Solo el receptor del mensaje puede marcarlo como leído.
     *
     * @param messageId ID del mensaje a marcar como leído
     * @param userEmail email del usuario autenticado
     * @return el mensaje actualizado
     */
    public Message markAsRead(UUID messageId, String userEmail) {
        log.info("Marcando mensaje {} como leído por {}", messageId, userEmail);

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado"));

        if (!message.getReceiver().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes marcar este mensaje como leído");
        }

        message.setIsRead(true);
        messageRepository.save(message);

        log.info("Mensaje {} marcado como leído", messageId);
        return message;
    }

    /**
     * Obtiene la cantidad de mensajes no leídos del usuario autenticado.
     */
    public long getUnreadCount(String userEmail) {
        log.debug("Obteniendo contador de mensajes no leídos para {}", userEmail);

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        return messageRepository.countUnreadMessagesByReceiver(user);
    }
}
