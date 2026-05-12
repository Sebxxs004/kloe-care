package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.User;
import com.universidad.kloe_care.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(UUID id, User user) {
        return userRepository.findById(id).map(existing -> {
            existing.setFullName(user.getFullName());
            existing.setEmail(user.getEmail());
            existing.setPassword(user.getPassword());
            existing.setPhoneNumber(user.getPhoneNumber());
            return userRepository.save(existing);
        });
    }

    public boolean deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }
}