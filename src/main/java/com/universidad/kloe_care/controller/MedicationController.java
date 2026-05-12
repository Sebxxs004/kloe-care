package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Medication;
import com.universidad.kloe_care.service.CrudItem;
import com.universidad.kloe_care.service.MedicationService;

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
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public ResponseEntity<List<Medication>> doGet() {
        return ResponseEntity.ok(medicationService.findAllMedications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medication> doGet(@PathVariable UUID id) {
        return medicationService.findMedicationById(id);
    }

    @PostMapping
    public ResponseEntity<Medication> doPost(@RequestBody Medication medication) {
        return medicationService.createMedication(medication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> doPut(@PathVariable UUID id, @RequestBody Medication medication) {
        return medicationService.updateMedication(id, medication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable UUID id) {
        return medicationService.deleteMedication(id);
    }
}