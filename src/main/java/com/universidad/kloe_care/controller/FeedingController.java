package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Feeding;
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
public class FeedingController extends AbstractInMemoryCrudController<Feeding> {

    @GetMapping
    public ResponseEntity<List<Resource<Feeding>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Feeding>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Feeding>> doPost(@RequestBody Feeding feeding) {
        return save(feeding);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Feeding>> doPut(@PathVariable Long id, @RequestBody Feeding feeding) {
        return update(id, feeding);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}