package com.universidad.kloe_care.repository;

import com.universidad.kloe_care.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PetRepository extends JpaRepository<Pet, UUID> {
}
