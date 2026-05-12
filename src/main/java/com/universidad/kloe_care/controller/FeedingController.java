package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Feeding;
import com.universidad.kloe_care.service.CrudItem;
import com.universidad.kloe_care.service.FeedingService;
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
@RequestMapping("/api/feedings")
public class FeedingController {

    private final FeedingService feedingService;

    public FeedingController(FeedingService feedingService) {
        this.feedingService = feedingService;
    }

    @GetMapping
    public ResponseEntity<List<CrudItem<Feeding>>> doGet() {
        return ResponseEntity.ok(feedingService.findAllFeedings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrudItem<Feeding>> doGet(@PathVariable Long id) {
        return feedingService.findFeedingById(id);
    }

    @PostMapping
    public ResponseEntity<CrudItem<Feeding>> doPost(@RequestBody Feeding feeding) {
        return feedingService.createFeeding(feeding);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CrudItem<Feeding>> doPut(@PathVariable Long id, @RequestBody Feeding feeding) {
        return feedingService.updateFeeding(id, feeding);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return feedingService.deleteFeeding(id);
    }
}