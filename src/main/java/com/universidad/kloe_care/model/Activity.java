package com.universidad.kloe_care.model;
/**
 * Representa una actividad física registrada para una mascota.
 */
public class Activity {

    private String activityType;  // Ej: caminata, juego
    private String duration;      // Ej: "30 minutos", "1 hora"
    private String observations;

    public Activity() {}

    public Activity(String activityType, String duration, String observations) {
        this.activityType = activityType;
        this.duration = duration;
        this.observations = observations;
    }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    @Override
    public String toString() {
        return "Activity{" +
                "activityType='" + activityType + '\'' +
                ", duration='" + duration + '\'' +
                ", observations='" + observations + '\'' +
                '}';
    }
}