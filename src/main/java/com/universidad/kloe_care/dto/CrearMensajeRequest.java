package com.universidad.kloe_care.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CrearMensajeRequest {

    @NotNull(message = "El ID del receptor es obligatorio")
    private UUID receptorId;

    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    public CrearMensajeRequest() {
    }

    public CrearMensajeRequest(UUID receptorId, String asunto, String contenido) {
        this.receptorId = receptorId;
        this.asunto = asunto;
        this.contenido = contenido;
    }

    public UUID getReceptorId() {
        return receptorId;
    }

    public void setReceptorId(UUID receptorId) {
        this.receptorId = receptorId;
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
}
