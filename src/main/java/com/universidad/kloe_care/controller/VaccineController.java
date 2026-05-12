package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.Vaccine;
import com.universidad.kloe_care.service.CrudItem;
import com.universidad.kloe_care.service.VaccineService;
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
@RequestMapping("/api/vaccines")
public class VaccineController {

    private final VaccineService vaccineService;

    public VaccineController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }

    @GetMapping
    public ResponseEntity<List<CrudItem<Vaccine>>> doGet() {
        return ResponseEntity.ok(vaccineService.findAllVaccines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrudItem<Vaccine>> doGet(@PathVariable Long id) {
        return vaccineService.findVaccineById(id);
    }

    @PostMapping
    public ResponseEntity<CrudItem<Vaccine>> doPost(@RequestBody Vaccine vaccine) {
        return vaccineService.createVaccine(vaccine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CrudItem<Vaccine>> doPut(@PathVariable Long id, @RequestBody Vaccine vaccine) {
        return vaccineService.updateVaccine(id, vaccine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> doDelete(@PathVariable Long id) {
        return vaccineService.deleteVaccine(id);
    }
}