package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Pet;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService extends AbstractInMemoryCrudService<Pet> {

    public List<CrudItem<Pet>> findAllPets() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Pet>> findPetById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Pet>> createPet(Pet pet) {
        return save(pet);
    }

    public ResponseEntity<CrudItem<Pet>> updatePet(Long id, Pet pet) {
        return update(id, pet);
    }

    public ResponseEntity<Void> deletePet(Long id) {
        return delete(id);
    }
}