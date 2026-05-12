package com.universidad.kloe_care.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private String activityType;  // Ej: caminata, juego
    private String duration;      // Ej: "30 minutos", "1 hora"
    private String observations;

    public Activity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    @Override
    public String toString() {
        return "Activity{" +
                "id=" + id +
                ", activityType='" + activityType + '\'' +
                ", duration='" + duration + '\'' +
                ", observations='" + observations + '\'' +
                '}';
    }
}
