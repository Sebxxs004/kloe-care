package com.universidad.kloe_care.model;

import java.util.Date;

public class Vaccine {

    // Información sobre vacunas administradas a la mascota (atributos comunes)
    private String name;
    private String laboratory;
    private Date appliedAt;
    private Date nextDoseAt;
    private String notes;

    // Constructor con todos los atributos
    public Vaccine(String name, String laboratory, Date appliedAt, Date nextDoseAt, String notes) {
        this.name = name;
        this.laboratory = laboratory;
        this.appliedAt = appliedAt;
        this.nextDoseAt = nextDoseAt;
        this.notes = notes;
    }

    // Constructor vacío para facilitar la creación de objetos sin necesidad de proporcionar todos los datos
    public Vaccine() {
    }

    // Getters y Setters para cada atributo
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLaboratory() {
        return laboratory;
    }

    public void setLaboratory(String laboratory) {
        this.laboratory = laboratory;
    }

    public Date getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(Date appliedAt) {
        this.appliedAt = appliedAt;
    }

    public Date getNextDoseAt() {
        return nextDoseAt;
    }

    public void setNextDoseAt(Date nextDoseAt) {
        this.nextDoseAt = nextDoseAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

}
