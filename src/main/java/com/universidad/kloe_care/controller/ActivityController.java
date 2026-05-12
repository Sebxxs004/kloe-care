package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Activity;
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
@RequestMapping("/api/activities")
public class ActivityController extends AbstractInMemoryCrudController<Activity> {

    @GetMapping
    public ResponseEntity<List<Resource<Activity>>> doGet() {
        return ResponseEntity.ok(findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<Activity>> doGet(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Resource<Activity>> doPost(@RequestBody Activity activity) {
        return save(activity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource<Activity>> doPut(@PathVariable Long id, @RequestBody Activity activity) {
        return update(id, activity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return delete(id);
    }
}