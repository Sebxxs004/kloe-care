package com.universidad.kloe_care.model;

import java.util.List;

public class WellnessHistory {

    // Historial de bienestar de la mascota, que incluye salud, alimentación y actividad física (atributos comunes)
    private List<Health> health;
    private List<Feeding> feeding;
    private List<Activity> activity;
    private String generalNotes;
    private Pet pet;

    // Constructor con todos los atributos  
    public WellnessHistory(List<Health> health, List<Feeding> feeding, List<Activity> activity, String generalNotes, Pet pet) {
        this.health = health;
        this.feeding = feeding;
        this.activity = activity;
        this.generalNotes = generalNotes;
        this.pet = pet;
    }

    // Constructor vacío para facilitar la creación de objetos sin necesidad de proporcionar todos los datos
    public WellnessHistory() {
    }

    // Getters y Setters para cada atributo
    public List<Health> getHealth() {
        return health;
    }

    public void setHealth(List<Health> health) {
        this.health = health;
    }

    public List<Feeding> getFeeding() {
        return feeding;
    }

    public void setFeeding(List<Feeding> feeding) {
        this.feeding = feeding;
    }

    public List<Activity> getActivity() {
        return activity;
    }

    public void setActivity(List<Activity> activity) {
        this.activity = activity;
    }

    public String getGeneralNotes() {
        return generalNotes;
    }

    public void setGeneralNotes(String generalNotes) {
        this.generalNotes = generalNotes;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    @Override
    public String toString() {
        return "WellnessHistory{" +
                "health=" + health +
                ", feeding=" + feeding +
                ", activity=" + activity +
                ", generalNotes='" + generalNotes + '\'' +
                ", pet=" + pet +
                '}';
    }
}
