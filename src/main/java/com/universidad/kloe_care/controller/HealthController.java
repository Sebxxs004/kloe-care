package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Health;
import com.universidad.kloe_care.service.CrudItem;
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

@RestController
@RequestMapping("/api/health-records")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    public ResponseEntity<List<CrudItem<Health>>> doGet() {
        return ResponseEntity.ok(healthService.findAllHealthRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrudItem<Health>> doGet(@PathVariable Long id) {
        return healthService.findHealthRecordById(id);
    }

    @PostMapping
    public ResponseEntity<CrudItem<Health>> doPost(@RequestBody Health health) {
        return healthService.createHealthRecord(health);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CrudItem<Health>> doPut(@PathVariable Long id, @RequestBody Health health) {
        return healthService.updateHealthRecord(id, health);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return healthService.deleteHealthRecord(id);
    }
}