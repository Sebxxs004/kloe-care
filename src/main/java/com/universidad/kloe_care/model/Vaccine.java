package com.universidad.kloe_care.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "vaccines")
public class Vaccine {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private String name;
    private String laboratory;
    private Date appliedAt;
    private Date nextDoseAt;
    private String notes;

    public Vaccine() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLaboratory() { return laboratory; }
    public void setLaboratory(String laboratory) { this.laboratory = laboratory; }

    public Date getAppliedAt() { return appliedAt; }
    public void setAppliedAt(Date appliedAt) { this.appliedAt = appliedAt; }

    public Date getNextDoseAt() { return nextDoseAt; }
    public void setNextDoseAt(Date nextDoseAt) { this.nextDoseAt = nextDoseAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "Vaccine{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", laboratory='" + laboratory + '\'' +
                ", appliedAt=" + appliedAt +
                ", nextDoseAt=" + nextDoseAt +
                ", notes='" + notes + '\'' +
                '}';
    }
}
