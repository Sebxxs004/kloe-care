package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Feeding;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedingService extends AbstractInMemoryCrudService<Feeding> {

    public List<CrudItem<Feeding>> findAllFeedings() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Feeding>> findFeedingById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Feeding>> createFeeding(Feeding feeding) {
        return save(feeding);
    }

    public ResponseEntity<CrudItem<Feeding>> updateFeeding(Long id, Feeding feeding) {
        return update(id, feeding);
    }

    public ResponseEntity<Void> deleteFeeding(Long id) {
        return delete(id);
    }
}