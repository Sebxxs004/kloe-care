package com.universidad.kloe_care.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "healths")
public class Health {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @PositiveOrZero(message = "La temperatura no puede ser negativa")
    private float temperature;

    @NotBlank(message = "El estado general es obligatorio")
    @Column(nullable = false)
    private String generalState;

    @NotNull(message = "La fecha del registro es obligatoria")
    private LocalDate recordDate;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> symptoms = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> vaccines = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> medications = new ArrayList<>();

    private String observations;

    public Health() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public float getTemperature() {
        return temperature;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public String getGeneralState() {
        return generalState;
    }

    public void setGeneralState(String generalState) {
        this.generalState = generalState;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getVaccines() {
        return vaccines;
    }

    public void setVaccines(List<String> vaccines) {
        this.vaccines = vaccines;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    @Override
    public String toString() {
        return "Health{"
                + "id=" + id
                + ", temperature=" + temperature
                + ", generalState='" + generalState + '\''
                + ", recordDate=" + recordDate
                + ", symptoms=" + symptoms
                + ", vaccines=" + vaccines
                + ", medications=" + medications
                + ", observations='" + observations + '\''
                + '}';
    }
}
