package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Activity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService extends AbstractInMemoryCrudService<Activity> {

    public List<CrudItem<Activity>> findAllActivities() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Activity>> findActivityById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Activity>> createActivity(Activity activity) {
        return save(activity);
    }

    public ResponseEntity<CrudItem<Activity>> updateActivity(Long id, Activity activity) {
        return update(id, activity);
    }

    public ResponseEntity<Void> deleteActivity(Long id) {
        return delete(id);
    }
}