package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Health;
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
@RequestMapping("/api/health-records")
public class HealthController extends AbstractInMemoryCrudController<Health> {

    @GetMapping
    public ResponseEntity<List<Resource<Health>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Health>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Health>> doPost(@RequestBody Health health) {
        return save(health);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Health>> doPut(@PathVariable Long id, @RequestBody Health health) {
        return update(id, health);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}