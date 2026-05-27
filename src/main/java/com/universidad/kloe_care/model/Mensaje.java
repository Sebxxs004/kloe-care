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

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mensajes")
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "emisor_id", nullable = false)
    @NotNull(message = "El emisor es obligatorio")
    private User emisor;

    @ManyToOne
    @JoinColumn(name = "receptor_id", nullable = false)
    @NotNull(message = "El receptor es obligatorio")
    private User receptor;

    @Column(nullable = false)
    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    @Column(nullable = false)
    private boolean leido = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    public Mensaje() {
    }

    public Mensaje(User emisor, User receptor, String asunto, String contenido) {
        this.emisor = emisor;
        this.receptor = receptor;
        this.asunto = asunto;
        this.contenido = contenido;
        this.leido = false;
        this.fechaEnvio = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getEmisor() {
        return emisor;
    }

    public void setEmisor(User emisor) {
        this.emisor = emisor;
    }

    public User getReceptor() {
        return receptor;
    }

    public void setReceptor(User receptor) {
        this.receptor = receptor;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    @Override
    public String toString() {
        return "Mensaje{"
                + "id=" + id
                + ", emisor=" + (emisor != null ? emisor.getId() : null)
                + ", receptor=" + (receptor != null ? receptor.getId() : null)
                + ", asunto='" + asunto + '\''
                + ", leido=" + leido
                + ", fechaEnvio=" + fechaEnvio
                + '}';
    }
}
