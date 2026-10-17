
package com.kavya.portfolio.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kavya.portfolio.entity.Portfolio;
import com.kavya.portfolio.service.PortfolioService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio")
    public Map<String, Object> getPortfolio() {

        Portfolio portfolio = portfolioService.getPortfolio();

        return Map.of(
            "name", portfolio.getName(),
            "role", portfolio.getRole(),
            "photoUrl", portfolio.getPhotoUrl(),
            "careerObjective", portfolio.getCareerObjective(),
            "skills", new String[] {
                "Java",
                "Spring Boot",
                "PostgreSQL",
                "HTML",
                "CSS",
                "JavaScript"
            },
            "message", "Welcome to my portfolio!"
        );
    }
}
