
package com.kavya.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kavya.portfolio.entity.Skill;
import com.kavya.portfolio.repository.SkillRepository;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional
    public List<String> getSkillNames() {

        if (skillRepository.count() == 0) {
            List<Skill> initialSkills = List.of(
                new Skill("Java", "Programming"),
                new Skill("Spring Boot", "Backend Development"),
                new Skill("PostgreSQL", "Database"),
                new Skill("HTML", "Frontend Development"),
                new Skill("CSS", "Frontend Development"),
                new Skill("JavaScript", "Frontend Development")
            );

            skillRepository.saveAll(initialSkills);
        }

        return skillRepository.findAllByOrderByIdAsc()
                .stream()
                .map(Skill::getName)
                .toList();
    }
}
