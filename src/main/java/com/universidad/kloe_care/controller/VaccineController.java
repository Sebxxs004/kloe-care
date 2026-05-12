package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Vaccine;
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
@RequestMapping("/api/vaccines")
public class VaccineController extends AbstractInMemoryCrudController<Vaccine> {

    @GetMapping
    public ResponseEntity<List<Resource<Vaccine>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Vaccine>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Vaccine>> doPost(@RequestBody Vaccine vaccine) {
        return save(vaccine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Vaccine>> doPut(@PathVariable Long id, @RequestBody Vaccine vaccine) {
        return update(id, vaccine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}