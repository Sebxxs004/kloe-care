package com.universidad.kloe_care.service;

import com.universidad.kloe_care.model.Vaccine;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccineService extends AbstractInMemoryCrudService<Vaccine> {

    public List<CrudItem<Vaccine>> findAllVaccines() {
        return findAll();
    }

    public ResponseEntity<CrudItem<Vaccine>> findVaccineById(Long id) {
        return findById(id);
    }

    public ResponseEntity<CrudItem<Vaccine>> createVaccine(Vaccine vaccine) {
        return save(vaccine);
    }

    public ResponseEntity<CrudItem<Vaccine>> updateVaccine(Long id, Vaccine vaccine) {
        return update(id, vaccine);
    }

    public ResponseEntity<Void> deleteVaccine(Long id) {
        return delete(id);
    }
}