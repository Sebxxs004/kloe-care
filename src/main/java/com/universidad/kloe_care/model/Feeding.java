package com.universidad.kloe_care.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

@Entity
@Table(name = "feedings")
public class Feeding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @NotBlank(message = "El tipo de comida es obligatorio")
    private String foodType;

    @Positive(message = "La cantidad debe ser mayor que cero")
    private double amount;

    @Column(nullable = false)
    @NotBlank(message = "El horario es obligatorio")
    private String schedule;

    @Positive(message = "La frecuencia debe ser mayor que cero")
    private int frequency;

    @Column(name = "nutritional_observations")
    private String nutritionalObservations;

    public Feeding() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public String getNutritionalObservations() {
        return nutritionalObservations;
    }

    public void setNutritionalObservations(String nutritionalObservations) {
        this.nutritionalObservations = nutritionalObservations;
    }

    @Override
    public String toString() {
        return "Feeding{"
                + "id=" + id
                + ", foodType='" + foodType + '\''
                + ", amount=" + amount
                + ", schedule='" + schedule + '\''
                + ", frequency=" + frequency
                + ", nutritionalObservations='" + nutritionalObservations + '\''
                + '}';
    }
}
