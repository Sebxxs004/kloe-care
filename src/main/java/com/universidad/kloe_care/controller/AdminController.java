package com.universidad.kloe_care.controller;

import com.universidad.kloe_care.dto.SolicitudesStatsDTO;
import com.universidad.kloe_care.service.SolicitudService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controlador Web (Thymeleaf) para paneles administrativos.
 * Todos los endpoints requieren autenticación ADMIN.
 * Header X-Admin: true para validar permisos.
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    private static final String ADMIN_HEADER = "X-Admin";

    private final SolicitudService solicitudService;

    public AdminController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    /**
     * GET /admin/solicitudes/panel
     * Panel de control de solicitudes para ADMIN.
     * Muestra indicadores y tabla de solicitudes.
     * Requiere header X-Admin: true.
     */
    @GetMapping("/solicitudes/panel")
    public String panelSolicitudes(
            @RequestHeader(value = ADMIN_HEADER, defaultValue = "false") String isAdmin,
            Model model) {

        boolean esAdmin = Boolean.parseBoolean(isAdmin);
        if (!esAdmin) {
            log.warn("Acceso no autorizado a panel administrativo");
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo ADMIN puede acceder a este panel"
            );
        }

        log.info("ADMIN accediendo a panel de solicitudes");

        SolicitudesStatsDTO stats = solicitudService.obtenerEstadisticas();

        model.addAttribute("stats", stats);
        model.addAttribute("appName", "KloeCare - Panel Administrativo");
        model.addAttribute("title", "Panel de Solicitudes");

        return "solicitudes-panel";
    }
}
