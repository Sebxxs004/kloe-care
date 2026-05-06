package com.universidad.kloe_care.model;

import java.util.List;

public class WellnessHistory {
    private List<Health> health;
    private List<Feeding> feeding;
    private List<Activity> activity;
    private String generalNotes;
    private Pet pet;

    public WellnessHistory(List<Health> health, List<Feeding> feeding, List<Activity> activityLogs, String generalNotes, Pet pet) {
        this.health = health;
        this.feeding = feeding;
        this.activityLogs = activityLogs;
        this.generalNotes = generalNotes;
        this.pet = pet;
    }

    public WellnessHistory() {
    }

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
}
