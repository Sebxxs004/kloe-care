package com.universidad.kloe_care.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "wellness_histories")
public class WellnessHistory {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Transient
    private List<Health> health;

    @Transient
    private List<Feeding> feeding;

    @Transient
    private List<Activity> activity;

    private String generalNotes;

    @ManyToOne
    private Pet pet;

    public WellnessHistory() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public List<Health> getHealth() { return health; }
    public void setHealth(List<Health> health) { this.health = health; }

    public List<Feeding> getFeeding() { return feeding; }
    public void setFeeding(List<Feeding> feeding) { this.feeding = feeding; }

    public List<Activity> getActivity() { return activity; }
    public void setActivity(List<Activity> activity) { this.activity = activity; }

    public String getGeneralNotes() { return generalNotes; }
    public void setGeneralNotes(String generalNotes) { this.generalNotes = generalNotes; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    @Override
    public String toString() {
        return "WellnessHistory{" +
                "id=" + id +
                ", generalNotes='" + generalNotes + '\'' +
                ", pet=" + (pet != null ? pet.getId() : null) +
                '}';
    }
}
