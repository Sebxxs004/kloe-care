package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Pet;
import com.universidad.kloe_care.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> doGet() {
        return ResponseEntity.ok(petService.findAllPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> doGet(@PathVariable UUID id) {
        return petService.findPetById(id);
    }

    @PostMapping
    public ResponseEntity<Pet> doPost(@RequestBody Pet pet) {
        return petService.createPet(pet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> doPut(@PathVariable UUID id, @RequestBody Pet pet) {
        return petService.updatePet(id, pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable UUID id) {
        return petService.deletePet(id);
    }
}