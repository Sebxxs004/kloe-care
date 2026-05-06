package com.universidad.kloe_care.model;
import java.util.List;

/**
 * Representa el registro de alimentación de una mascota.
 */
public class Feeding {

    private List<String> foodType;  // Tipos de alimento (ej: croquetas, pollo)
    private String foodBrand;
    private double amount;          // Cantidad en gramos o ml
    private String schedule;        // Horario de alimentación (ej: "8:00 AM")
    private int frequency;          // Veces al día que se alimenta
    private String observations;

    public Feeding() {}

    public Feeding(List<String> foodType, String foodBrand, double amount,
        String schedule, int frequency, String observations) {
        this.foodType = foodType;
        this.foodBrand = foodBrand;
        this.amount = amount;
        this.schedule = schedule;
        this.frequency = frequency;
        this.observations = observations;
    }

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
                "foodType=" + foodType +
                ", foodBrand='" + foodBrand + '\'' +
                ", amount=" + amount +
                ", schedule='" + schedule + '\'' +
                ", frequency=" + frequency +
                ", observations='" + observations + '\'' +
                '}';
    }
}