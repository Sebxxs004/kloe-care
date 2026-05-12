package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.WellnessHistory;
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
@RequestMapping("/api/wellness-histories")
public class WellnessHistoryController extends AbstractInMemoryCrudController<WellnessHistory> {

    @GetMapping
    public ResponseEntity<List<Resource<WellnessHistory>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<WellnessHistory>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<WellnessHistory>> doPost(@RequestBody WellnessHistory wellnessHistory) {
        return save(wellnessHistory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<WellnessHistory>> doPut(@PathVariable Long id, @RequestBody WellnessHistory wellnessHistory) {
        return update(id, wellnessHistory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}