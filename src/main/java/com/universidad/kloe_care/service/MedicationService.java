package com.universidad.kloe_care.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.universidad.kloe_care.model.Medication;
import com.universidad.kloe_care.repository.MedicationRepository;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> findAllMedications() {
        return medicationRepository.findAll();
    }

    public ResponseEntity<Medication> findMedicationById(UUID id) {
        Optional<Medication> m = medicationRepository.findById(id);
        return m.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Medication> createMedication(Medication medication) {
        Medication saved = medicationRepository.save(medication);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Medication> updateMedication(UUID id, Medication medication) {
        if (!medicationRepository.existsById(id)) return ResponseEntity.notFound().build();
        medication.setId(id);
        Medication saved = medicationRepository.save(medication);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteMedication(UUID id) {
        if (!medicationRepository.existsById(id)) return ResponseEntity.notFound().build();
        medicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}