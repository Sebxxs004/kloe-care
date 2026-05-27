package com.universidad.kloe_care.dto;

public class CrearSolicitudRequest {

    private String tipo;
    private String descripcion;

    public CrearSolicitudRequest() {}

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}