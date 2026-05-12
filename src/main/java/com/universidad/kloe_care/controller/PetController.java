package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Pet;
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

@RestController
@RequestMapping("/api/pets")
public class PetController extends AbstractInMemoryCrudController<Pet> {

    @GetMapping
    public ResponseEntity<List<Resource<Pet>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Pet>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Pet>> doPost(@RequestBody Pet pet) {
        return save(pet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Pet>> doPut(@PathVariable Long id, @RequestBody Pet pet) {
        return update(id, pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}