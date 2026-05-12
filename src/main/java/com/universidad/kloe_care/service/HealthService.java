package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Health;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthService extends AbstractInMemoryCrudService<Health> {

    public List<CrudItem<Health>> findAllHealthRecords() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Health>> findHealthRecordById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Health>> createHealthRecord(Health health) {
        return save(health);
    }

    public ResponseEntity<CrudItem<Health>> updateHealthRecord(Long id, Health health) {
        return update(id, health);
    }

    public ResponseEntity<Void> deleteHealthRecord(Long id) {
        return delete(id);
    }
}