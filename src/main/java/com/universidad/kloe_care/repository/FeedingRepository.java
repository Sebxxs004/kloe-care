package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Feeding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FeedingRepository extends JpaRepository<Feeding, UUID> {
}
