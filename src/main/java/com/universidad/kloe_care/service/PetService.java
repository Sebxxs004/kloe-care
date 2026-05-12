package com.universidad.kloe_care.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.universidad.kloe_care.model.Pet;
import com.universidad.kloe_care.repository.PetRepository;

@Service
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> findAllPets() {
        return petRepository.findAll();
    }

    public ResponseEntity<Pet> findPetById(UUID id) {
        Optional<Pet> p = petRepository.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Pet> createPet(Pet pet) {
        Pet saved = petRepository.save(pet);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Pet> updatePet(UUID id, Pet pet) {
        if (!petRepository.existsById(id)) return ResponseEntity.notFound().build();
        pet.setId(id);
        Pet saved = petRepository.save(pet);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deletePet(UUID id) {
        if (!petRepository.existsById(id)) return ResponseEntity.notFound().build();
        petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}