package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Solicitud;
import com.universidad.kloe_care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SolicitudRepository extends JpaRepository<Solicitud, UUID> {

    List<Solicitud> findBySolicitanteOrderByFechaCreacionDesc(User solicitante);
}
