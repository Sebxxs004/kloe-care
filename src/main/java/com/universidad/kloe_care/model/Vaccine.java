package com.universidad.kloe_care.model;

import java.util.Date;

public class Vaccine {

    private String name;
    private String laboratory;
    private Date appliedAt;
    private Date nextDoseAt;
    private String notes;

    public Vaccine(String name, String laboratory, Date appliedAt, Date nextDoseAt, String notes) {
        this.name = name;
        this.laboratory = laboratory;
        this.appliedAt = appliedAt;
        this.nextDoseAt = nextDoseAt;
        this.notes = notes;
    }

    public Vaccine() {
    }

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
