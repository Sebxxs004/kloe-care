package com.universidad.kloe_care.model;

import java.util.Date;
import java.util.List;

/**
 * Representa una mascota asociada al historial de bienestar.
 */
public class Pet {

    private String name;
    private String species;
    private String breed;
    private double weight;
    private List<String> gender;
    private Date birthDate;
    private User owner;

    public Pet() {
    }

    public Pet(String name, String species, String breed, double weight, List<String> gender, Date birthDate, User owner) {
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.weight = weight;
        this.gender = gender;
        this.birthDate = birthDate;
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public List<String> getGender() {
        return gender;
    }

    public void setGender(List<String> gender) {
        this.gender = gender;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "name='" + name + '\'' +
                ", species='" + species + '\'' +
                ", breed='" + breed + '\'' +
                ", weight=" + weight +
                ", gender=" + gender +
                ", birthDate=" + birthDate +
                ", owner=" + owner +
                '}';
    }
}