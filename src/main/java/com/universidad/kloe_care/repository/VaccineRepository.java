package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VaccineRepository extends JpaRepository<Vaccine, UUID> {
}
