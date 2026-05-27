package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Message;
import com.universidad.kloe_care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

/**
 * Repositorio para la entidad Message.
 * Proporciona métodos para consultar mensajes por remitente y destinatario.
 */
public interface MessageRepository extends JpaRepository<Message, UUID> {

    /**
     * Encuentra todos los mensajes recibidos por un usuario (bandeja de entrada).
     */
    List<Message> findByReceiver(User receiver);

    /**
     * Encuentra todos los mensajes enviados por un usuario.
     */
    List<Message> findBySender(User sender);

    /**
     * Cuenta los mensajes no leídos recibidos por un usuario.
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :receiver AND m.isRead = false")
    long countUnreadMessagesByReceiver(@Param("receiver") User receiver);
}
