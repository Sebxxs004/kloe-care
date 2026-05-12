package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.WellnessHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WellnessHistoryRepository extends JpaRepository<WellnessHistory, UUID> {
}
