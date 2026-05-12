package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Medication;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService extends AbstractInMemoryCrudService<Medication> {

    public List<CrudItem<Medication>> findAllMedications() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Medication>> findMedicationById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Medication>> createMedication(Medication medication) {
        return save(medication);
    }

    public ResponseEntity<CrudItem<Medication>> updateMedication(Long id, Medication medication) {
        return update(id, medication);
    }

    public ResponseEntity<Void> deleteMedication(Long id) {
        return delete(id);
    }
}