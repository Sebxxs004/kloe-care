package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Mensaje;
import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.MensajeRepository;
import com.universidad.kloe_care.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MensajeService {

    private static final Logger log = LoggerFactory.getLogger(MensajeService.class);

    private final MensajeRepository mensajeRepository;
    private final UserRepository userRepository;

    public MensajeService(MensajeRepository mensajeRepository, UserRepository userRepository) {
        this.mensajeRepository = mensajeRepository;
        this.userRepository = userRepository;
    }

    public Mensaje crearMensaje(UUID emisorId, UUID receptorId, String asunto, String contenido) {
        log.info("Creando mensaje de {} a {}", emisorId, receptorId);

        User emisor = userRepository.findById(emisorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emisor no encontrado"));

        User receptor = userRepository.findById(receptorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receptor no encontrado"));

        Mensaje mensaje = new Mensaje(emisor, receptor, asunto, contenido);
        Mensaje saved = mensajeRepository.save(mensaje);
        log.info("Mensaje creado con ID: {}", saved.getId());
        return saved;
    }

    public List<Mensaje> obtenerBandejaEntrada(UUID usuarioId) {
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return mensajeRepository.findByReceptorOrderByFechaEnvioDesc(usuario);
    }

    public List<Mensaje> obtenerEnviados(UUID usuarioId) {
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return mensajeRepository.findByEmisorOrderByFechaEnvioDesc(usuario);
    }

    public Mensaje marcarComoLeido(UUID mensajeId, UUID usuarioId) {
        Mensaje mensaje = mensajeRepository.findById(mensajeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado"));

        if (!mensaje.getReceptor().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para marcar este mensaje como leído");
        }

        mensaje.setLeido(true);
        Mensaje updated = mensajeRepository.save(mensaje);
        log.info("Mensaje {} marcado como leído", mensajeId);
        return updated;
    }

    public long obtenerCountNoLeidos(UUID usuarioId) {
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return mensajeRepository.countNoLeidosByReceptor(usuario);
    }
}
