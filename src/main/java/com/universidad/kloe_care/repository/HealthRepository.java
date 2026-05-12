package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Health;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HealthRepository extends JpaRepository<Health, UUID> {
}
