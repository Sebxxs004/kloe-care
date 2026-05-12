package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Activity;
import com.universidad.kloe_care.service.ActivityService;
import com.universidad.kloe_care.service.CrudItem;
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
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<CrudItem<Activity>>> doGet() {
        return ResponseEntity.ok(activityService.findAllActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrudItem<Activity>> doGet(@PathVariable Long id) {
        return activityService.findActivityById(id);
    }

    @PostMapping
    public ResponseEntity<CrudItem<Activity>> doPost(@RequestBody Activity activity) {
        return activityService.createActivity(activity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CrudItem<Activity>> doPut(@PathVariable Long id, @RequestBody Activity activity) {
        return activityService.updateActivity(id, activity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return activityService.deleteActivity(id);
    }
}