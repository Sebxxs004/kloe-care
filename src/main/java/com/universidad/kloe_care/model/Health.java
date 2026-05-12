package com.universidad.kloe_care.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "healths")
public class Health {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private float temperature;
    private float weight;

    @ElementCollection
    private List<String> symptoms;

    // For now, complex nested lists are left transient; they can be modeled later
    @Transient
    private List<Vaccine> vaccines;

    @Transient
    private List<Medication> medications;

    private String observations;

    public Health() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public float getTemperature() { return temperature; }
    public void setTemperature(float temperature) { this.temperature = temperature; }

    public float getWeight() { return weight; }
    public void setWeight(float weight) { this.weight = weight; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<Vaccine> getVaccines() { return vaccines; }
    public void setVaccines(List<Vaccine> vaccines) { this.vaccines = vaccines; }

    public List<Medication> getMedications() { return medications; }
    public void setMedications(List<Medication> medications) { this.medications = medications; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    @Override
    public String toString() {
        return "Health{" +
                "id=" + id +
                ", temperature=" + temperature +
                ", weight=" + weight +
                ", symptoms=" + symptoms +
                ", observations='" + observations + '\'' +
                '}';
    }
}
