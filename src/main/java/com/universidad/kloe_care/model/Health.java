package com.universidad.kloe_care.model;

import java.util.List;

public class Health {

    // Información de salud general (Atributos comunes)
    private float temperature;
    private float weight;
    private List<String> symptoms;
    private List<Vaccine> vaccines;
    private List<Medication> medications;
    private String observations;

    // Constructor con todos los atributos
    public Health(float temperature, float weight, List<String> symptoms, List<Vaccine> vaccines, List<Medication> medications, String observations) {
        this.temperature = temperature;
        this.weight = weight;
        this.symptoms = symptoms;
        this.vaccines = vaccines;
        this.medications = medications;
        this.observations = observations;
    }

    // Constructor vacío para facilitar la creación de objetos sin necesidad de proporcionar todos los datos
    public Health() {
    }

    // Getters y Setters para cada atributo
    public float getTemperature() {
        return temperature;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<Vaccine> getVaccines() {
        return vaccines;
    }

    public void setVaccines(List<Vaccine> vaccines) {
        this.vaccines = vaccines;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

}
