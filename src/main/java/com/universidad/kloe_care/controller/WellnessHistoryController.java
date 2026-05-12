package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.WellnessHistory;
import com.universidad.kloe_care.service.CrudItem;
import com.universidad.kloe_care.service.WellnessHistoryService;
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
@RequestMapping("/api/wellness-histories")
public class WellnessHistoryController {

    private final WellnessHistoryService wellnessHistoryService;

    public WellnessHistoryController(WellnessHistoryService wellnessHistoryService) {
        this.wellnessHistoryService = wellnessHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<CrudItem<WellnessHistory>>> doGet() {
        return ResponseEntity.ok(wellnessHistoryService.findAllWellnessHistories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrudItem<WellnessHistory>> doGet(@PathVariable Long id) {
        return wellnessHistoryService.findWellnessHistoryById(id);
    }

    @PostMapping
    public ResponseEntity<CrudItem<WellnessHistory>> doPost(@RequestBody WellnessHistory wellnessHistory) {
        return wellnessHistoryService.createWellnessHistory(wellnessHistory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CrudItem<WellnessHistory>> doPut(@PathVariable Long id, @RequestBody WellnessHistory wellnessHistory) {
        return wellnessHistoryService.updateWellnessHistory(id, wellnessHistory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return wellnessHistoryService.deleteWellnessHistory(id);
    }
}