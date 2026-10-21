
package com.kavya.portfolio.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.kavya.portfolio.entity.Skill;
import com.kavya.portfolio.repository.SkillRepository;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<String> getSkillNames() {
        return skillRepository.findAllByOrderByIdAsc()
                .stream()
                .map(Skill::getName)
                .toList();
    }

    @Transactional(readOnly = true)
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Skill not found"));
    }

    @Transactional
    public Skill addSkill(Map<String, String> request) {
        String name = required(request, "name");
        String category = required(request, "category");

        if (skillRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Skill already exists");
        }

        return skillRepository.save(new Skill(name, category));
    }

    @Transactional
    public Skill replaceSkill(Long id, Map<String, String> request) {
        Skill skill = getSkillById(id);

        String name = required(request, "name");
        String category = required(request, "category");

        if (!skill.getName().equalsIgnoreCase(name)
                && skillRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Skill already exists");
        }

        skill.setName(name);
        skill.setCategory(category);

        return skillRepository.save(skill);
    }

    @Transactional
    public Skill patchSkill(Long id, Map<String, String> request) {
        Skill skill = getSkillById(id);

        if (request == null || request.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Provide at least one field");
        }

        if (request.containsKey("name")) {
            String name = required(request, "name");

            if (!skill.getName().equalsIgnoreCase(name)
                    && skillRepository.existsByNameIgnoreCase(name)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Skill already exists");
            }

            skill.setName(name);
        }

        if (request.containsKey("category")) {
            skill.setCategory(required(request, "category"));
        }

        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
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
