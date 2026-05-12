package com.universidad.kloe_care.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.universidad.kloe_care.model.Feeding;
import com.universidad.kloe_care.repository.FeedingRepository;

@Service
public class FeedingService {

    private final FeedingRepository feedingRepository;

    public FeedingService(FeedingRepository feedingRepository) {
        this.feedingRepository = feedingRepository;
    }

    public List<Feeding> findAllFeedings() {
        return feedingRepository.findAll();
    }

    public ResponseEntity<Feeding> findFeedingById(UUID id) {
        Optional<Feeding> f = feedingRepository.findById(id);
        return f.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Feeding> createFeeding(Feeding feeding) {
        Feeding saved = feedingRepository.save(feeding);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Feeding> updateFeeding(UUID id, Feeding feeding) {
        if (!feedingRepository.existsById(id)) return ResponseEntity.notFound().build();
        feeding.setId(id);
        Feeding saved = feedingRepository.save(feeding);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteFeeding(UUID id) {
        if (!feedingRepository.existsById(id)) return ResponseEntity.notFound().build();
        feedingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}