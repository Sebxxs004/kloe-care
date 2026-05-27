package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.model.SolicitudEstado;
import com.universidad.kloe_care.repository.SolicitudRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SolicitudPanelController {

    private final SolicitudRepository solicitudRepository;

    public SolicitudPanelController(SolicitudRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    @GetMapping("/admin/solicitudes/panel")
    public String panel(Model model) {
        model.addAttribute("solicitudes", solicitudRepository.findAll());
        model.addAttribute("total",      solicitudRepository.count());
        model.addAttribute("pendientes", solicitudRepository.countByEstado(SolicitudEstado.PENDIENTE));
        model.addAttribute("aprobadas",  solicitudRepository.countByEstado(SolicitudEstado.APROBADA));
        model.addAttribute("rechazadas", solicitudRepository.countByEstado(SolicitudEstado.RECHAZADA));
        return "admin/panel";
    }
}