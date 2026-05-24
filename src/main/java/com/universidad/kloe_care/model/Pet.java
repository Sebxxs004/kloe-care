package com.universidad.kloe_care.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @NotBlank(message = "El nombre de la mascota es obligatorio")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "La especie es obligatoria")
    private String species;

    @Column(nullable = false)
    @NotBlank(message = "La raza es obligatoria")
    private String breed;

    @PositiveOrZero(message = "La edad no puede ser negativa")
    private int age;

    @PositiveOrZero(message = "El peso no puede ser negativo")
    private double weight;

    @Column(nullable = false)
    @NotBlank(message = "El sexo es obligatorio")
    private String sex;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate birthDate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    public Pet() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
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
        return "Pet{"
                + "id=" + id
                + ", name='" + name + '\''
                + ", species='" + species + '\''
                + ", breed='" + breed + '\''
                + ", age=" + age
                + ", weight=" + weight
                + ", sex='" + sex + '\''
                + ", birthDate=" + birthDate
                + ", owner=" + (owner != null ? owner.getId() : null)
                + '}';
    }
}
