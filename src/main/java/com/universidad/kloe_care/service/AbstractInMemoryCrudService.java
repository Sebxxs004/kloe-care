package com.universidad.kloe_care.service;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

abstract class AbstractInMemoryCrudService<T> {

    private final Map<Long, T> storage = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    protected List<CrudItem<T>> findAll() {
        return storage.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new CrudItem<>(entry.getKey(), entry.getValue()))
                .toList();
    }

    protected ResponseEntity<CrudItem<T>> findById(Long id) {
        T value = storage.get(id);
        if (value == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new CrudItem<>(id, value));
    }

    protected ResponseEntity<CrudItem<T>> save(T value) {
        long id = sequence.incrementAndGet();
        storage.put(id, value);
        return ResponseEntity.status(201).body(new CrudItem<>(id, value));
    }

    protected ResponseEntity<CrudItem<T>> update(Long id, T value) {
        if (!storage.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }

        storage.put(id, value);
        return ResponseEntity.ok(new CrudItem<>(id, value));
    }

    protected ResponseEntity<Void> delete(Long id) {
        return storage.remove(id) != null
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}