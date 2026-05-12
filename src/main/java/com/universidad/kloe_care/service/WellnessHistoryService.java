package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.WellnessHistory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WellnessHistoryService extends AbstractInMemoryCrudService<WellnessHistory> {

    public List<CrudItem<WellnessHistory>> findAllWellnessHistories() {
        return findAll();
    }

    public ResponseEntity<CrudItem<WellnessHistory>> findWellnessHistoryById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<WellnessHistory>> createWellnessHistory(WellnessHistory wellnessHistory) {
        return save(wellnessHistory);
    }

    public ResponseEntity<CrudItem<WellnessHistory>> updateWellnessHistory(Long id, WellnessHistory wellnessHistory) {
        return update(id, wellnessHistory);
    }

    public ResponseEntity<Void> deleteWellnessHistory(Long id) {
        return delete(id);
    }
}