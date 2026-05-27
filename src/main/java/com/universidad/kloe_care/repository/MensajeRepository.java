package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Mensaje;
import com.universidad.kloe_care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MensajeRepository extends JpaRepository<Mensaje, UUID> {

    List<Mensaje> findByReceptorOrderByFechaEnvioDesc(User receptor);

    List<Mensaje> findByEmisorOrderByFechaEnvioDesc(User emisor);

    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.receptor = :receptor AND m.leido = false")
    long countNoLeidosByReceptor(@Param("receptor") User receptor);
}
