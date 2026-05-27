package com.universidad.kloe_care.dto;

import com.universidad.kloe_care.model.Solicitud;
import java.util.List;

public class SolicitudesStatsDTO {

    private long total;
    private long pendientes;
    private long aprobadas;
    private long rechazadas;
    private List<Solicitud> solicitudes;

    public SolicitudesStatsDTO(List<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
        this.total = solicitudes.size();
        this.pendientes = solicitudes.stream()
                .filter(s -> s.getEstado().toString().equals("PENDIENTE"))
                .count();
        this.aprobadas = solicitudes.stream()
                .filter(s -> s.getEstado().toString().equals("APROBADA"))
                .count();
        this.rechazadas = solicitudes.stream()
                .filter(s -> s.getEstado().toString().equals("RECHAZADA"))
                .count();
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPendientes() {
        return pendientes;
    }

    public void setPendientes(long pendientes) {
        this.pendientes = pendientes;
    }

    public long getAprobadas() {
        return aprobadas;
    }

    public void setAprobadas(long aprobadas) {
        this.aprobadas = aprobadas;
    }

    public long getRechazadas() {
        return rechazadas;
    }

    public void setRechazadas(long rechazadas) {
        this.rechazadas = rechazadas;
    }

    public List<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(List<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }
}
