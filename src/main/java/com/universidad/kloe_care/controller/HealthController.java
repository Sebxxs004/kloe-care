package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Health;
import com.universidad.kloe_care.service.HealthService;
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
@RequestMapping("/api/health-records")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    public ResponseEntity<List<Health>> doGet() {
        return ResponseEntity.ok(healthService.findAllHealths());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Health> doGet(@PathVariable UUID id) {
        return healthService.findHealthById(id);
    }

    @PostMapping
    public ResponseEntity<Health> doPost(@RequestBody Health health) {
        return healthService.createHealth(health);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Health> doPut(@PathVariable UUID id, @RequestBody Health health) {
        return healthService.updateHealth(id, health);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable UUID id) {
        return healthService.deleteHealth(id);
    }
}