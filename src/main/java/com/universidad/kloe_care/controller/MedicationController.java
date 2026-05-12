package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Medication;
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
@RequestMapping("/api/medications")
public class MedicationController extends AbstractInMemoryCrudController<Medication> {

    @GetMapping
    public ResponseEntity<List<Resource<Medication>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Medication>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Medication>> doPost(@RequestBody Medication medication) {
        return save(medication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Medication>> doPut(@PathVariable Long id, @RequestBody Medication medication) {
        return update(id, medication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}