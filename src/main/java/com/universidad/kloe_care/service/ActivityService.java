package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Activity;
import com.universidad.kloe_care.repository.ActivityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAllActivities() {
        return activityRepository.findAll();
    }

    public ResponseEntity<Activity> findActivityById(UUID id) {
        Optional<Activity> a = activityRepository.findById(id);
        return a.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Activity> createActivity(Activity activity) {
        Activity saved = activityRepository.save(activity);
        return ResponseEntity.status(201).body(saved);
    }

    public ResponseEntity<Activity> updateActivity(UUID id, Activity activity) {
        if (!activityRepository.existsById(id)) return ResponseEntity.notFound().build();
        activity.setId(id);
        Activity saved = activityRepository.save(activity);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<Void> deleteActivity(UUID id) {
        if (!activityRepository.existsById(id)) return ResponseEntity.notFound().build();
        activityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}