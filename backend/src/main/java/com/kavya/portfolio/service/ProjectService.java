
package com.kavya.portfolio.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.kavya.portfolio.entity.Project;
import com.kavya.portfolio.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByIdAsc();
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found"));
    }

    @Transactional
    public Project addProject(Map<String, String> request) {
        return projectRepository.save(new Project(
                required(request, "title"),
                required(request, "description"),
                required(request, "technologies")
        ));
    }

    @Transactional
    public Project replaceProject(Long id, Map<String, String> request) {
        Project project = getProjectById(id);

        project.setTitle(required(request, "title"));
        project.setDescription(required(request, "description"));
        project.setTechnologies(required(request, "technologies"));

        return projectRepository.save(project);
    }

    @Transactional
    public Project patchProject(Long id, Map<String, String> request) {
        Project project = getProjectById(id);

        if (request == null || request.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Provide at least one field");
        }

        if (request.containsKey("title")) {
            project.setTitle(required(request, "title"));
        }

        if (request.containsKey("description")) {
            project.setDescription(required(request, "description"));
        }

        if (request.containsKey("technologies")) {
            project.setTechnologies(required(request, "technologies"));
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    private String required(Map<String, String> request, String field) {
        String value = request == null ? null : request.get(field);

        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, field + " is required");
        }

        return value.trim();
    }
}
