package com.universidad.kloe_care.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.universidad.kloe_care.model.Health;
import com.universidad.kloe_care.repository.HealthRepository;

@Service
public class HealthService {

    private final HealthRepository healthRepository;

    public HealthService(HealthRepository healthRepository) {
        this.healthRepository = healthRepository;
    }

    public List<Health> findAllHealths() { return healthRepository.findAll(); }

    public ResponseEntity<Health> findHealthById(UUID id) {
        Optional<Health> h = healthRepository.findById(id);
        return h.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Health> createHealth(Health health) {
        Health saved = healthRepository.save(health);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Health> updateHealth(UUID id, Health health) {
        if (!healthRepository.existsById(id)) return ResponseEntity.notFound().build();
        health.setId(id);
        Health saved = healthRepository.save(health);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteHealth(UUID id) {
        if (!healthRepository.existsById(id)) return ResponseEntity.notFound().build();
        healthRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}