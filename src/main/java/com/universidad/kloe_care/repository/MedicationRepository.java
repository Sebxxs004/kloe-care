package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicationRepository extends JpaRepository<Medication, UUID> {
}
