package com.universidad.kloe_care.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping({"/", "/index"})
    public String index(Model model) {
        model.addAttribute("appName", "Kloe Care");
        return "index";
    }

    @GetMapping("/users-ui")
    public String users() {
        return "users";
    }

    @GetMapping("/pets-ui")
    public String pets() {
        return "pets";
    }

    @GetMapping("/health-ui")
    public String health() {
        return "health";
    }

    @GetMapping("/feeding-ui")
    public String feeding() {
        return "feeding";
    }
}
