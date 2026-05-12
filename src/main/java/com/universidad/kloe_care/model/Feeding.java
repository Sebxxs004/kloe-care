package com.universidad.kloe_care.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "feedings")
public class Feeding {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ElementCollection
    private List<String> foodType;
    private String foodBrand;
    private double amount;
    private String schedule;
    private int frequency;
    private String observations;

    public Feeding() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public List<String> getFoodType() { return foodType; }
    public void setFoodType(List<String> foodType) { this.foodType = foodType; }

    public String getFoodBrand() { return foodBrand; }
    public void setFoodBrand(String foodBrand) { this.foodBrand = foodBrand; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }

    public int getFrequency() { return frequency; }
    public void setFrequency(int frequency) { this.frequency = frequency; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    @Override
    public String toString() {
        return "Feeding{" +
                "id=" + id +
                ", foodType=" + foodType +
                ", foodBrand='" + foodBrand + '\'' +
                ", amount=" + amount +
                ", schedule='" + schedule + '\'' +
                ", frequency=" + frequency +
                ", observations='" + observations + '\'' +
                '}';
    }
}
