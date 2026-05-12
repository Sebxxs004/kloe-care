package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.WellnessHistory;
import com.universidad.kloe_care.repository.WellnessHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WellnessHistoryService {

    private final WellnessHistoryRepository wellnessHistoryRepository;

    public WellnessHistoryService(WellnessHistoryRepository wellnessHistoryRepository) {
        this.wellnessHistoryRepository = wellnessHistoryRepository;
    }

    public List<WellnessHistory> findAllWellnessHistories() { return wellnessHistoryRepository.findAll(); }

    public ResponseEntity<WellnessHistory> findWellnessHistoryById(UUID id) {
        Optional<WellnessHistory> w = wellnessHistoryRepository.findById(id);
        return w.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<WellnessHistory> createWellnessHistory(WellnessHistory wellnessHistory) {
        WellnessHistory saved = wellnessHistoryRepository.save(wellnessHistory);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<WellnessHistory> updateWellnessHistory(UUID id, WellnessHistory wellnessHistory) {
        if (!wellnessHistoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        wellnessHistory.setId(id);
        WellnessHistory saved = wellnessHistoryRepository.save(wellnessHistory);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteWellnessHistory(UUID id) {
        if (!wellnessHistoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        wellnessHistoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}