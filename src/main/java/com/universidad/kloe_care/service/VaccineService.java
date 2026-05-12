package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Vaccine;
import com.universidad.kloe_care.repository.VaccineRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VaccineService {

    private final VaccineRepository vaccineRepository;

    public VaccineService(VaccineRepository vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    public List<Vaccine> findAllVaccines() { return vaccineRepository.findAll(); }

    public ResponseEntity<Vaccine> findVaccineById(UUID id) {
        Optional<Vaccine> v = vaccineRepository.findById(id);
        return v.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Vaccine> createVaccine(Vaccine vaccine) {
        Vaccine saved = vaccineRepository.save(vaccine);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Vaccine> updateVaccine(UUID id, Vaccine vaccine) {
        if (!vaccineRepository.existsById(id)) return ResponseEntity.notFound().build();
        vaccine.setId(id);
        Vaccine saved = vaccineRepository.save(vaccine);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteVaccine(UUID id) {
        if (!vaccineRepository.existsById(id)) return ResponseEntity.notFound().build();
        vaccineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}