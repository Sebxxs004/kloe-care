package com.universidad.kloe_care.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.ResponseEntity;

abstract class AbstractInMemoryCrudController<T> {

    private final Map<Long, T> storage = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    protected List<Resource<T>> findAll() {
        return storage.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new Resource<>(entry.getKey(), entry.getValue()))
                .toList();
    }

    protected ResponseEntity<Resource<T>> findById(Long id) {
        T value = storage.get(id);
        if (value == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new Resource<>(id, value));
    }

    protected ResponseEntity<Resource<T>> save(T value) {
        long id = sequence.incrementAndGet();
        storage.put(id, value);
        return ResponseEntity.status(201).body(new Resource<>(id, value));
    }

    protected ResponseEntity<Resource<T>> update(Long id, T value) {
        if (!storage.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }

        storage.put(id, value);
        return ResponseEntity.ok(new Resource<>(id, value));
    }

    protected ResponseEntity<Void> delete(Long id) {
        return storage.remove(id) != null
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    protected record Resource<T>(Long id, T data) {
    }
}