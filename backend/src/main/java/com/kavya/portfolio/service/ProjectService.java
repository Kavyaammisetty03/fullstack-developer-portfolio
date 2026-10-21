
package com.kavya.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kavya.portfolio.entity.Project;
import com.kavya.portfolio.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional
    public List<Project> getAllProjects() {

        if (projectRepository.count() == 0) {
            List<Project> initialProjects = List.of(
                new Project(
                    "Library Management Application",
                    "Developed a library management backend using Java, Spring Boot, and PostgreSQL. Implemented authentication, role-based access, book search, uploads, availability checks, purchases, and returns using a layered architecture.",
                    "Java, Spring Boot, PostgreSQL, Spring Data JPA, Spring Security, Maven, Git"
                ),
                new Project(
                    "RailPharma",
                    "Developed a medicine delivery website that helps users browse medicines, view product details, and conveniently explore medicine ordering functionality.",
                    "HTML, CSS, JavaScript, SQL, React"
                ),
                new Project(
                    "AI Road Safety System",
                    "Developed a road safety application featuring user registration, login, a vehicle and road information dashboard, route analysis, and pothole image detection with detected areas highlighted in red.",
                    "AI, Python, Web Development"
                ),
                new Project(
                    "Fitness Tracker",
                    "Created a fitness application with yoga poses, exercises, and wellness activities designed to encourage healthy routines for children and adults.",
                    "HTML, CSS, JavaScript"
                )
            );

            projectRepository.saveAll(initialProjects);
        }

        return projectRepository.findAllByOrderByIdAsc();
    }
}
