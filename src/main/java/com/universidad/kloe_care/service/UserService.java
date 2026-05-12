package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService extends AbstractInMemoryCrudService<User> {

    public List<CrudItem<User>> findAllUsers() {
        return findAll();
    }

    public ResponseEntity<CrudItem<User>> findUserById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<User>> createUser(User user) {
        return save(user);
    }

    public ResponseEntity<CrudItem<User>> updateUser(Long id, User user) {
        return update(id, user);
    }

    public ResponseEntity<Void> deleteUser(Long id) {
        return delete(id);
    }
}