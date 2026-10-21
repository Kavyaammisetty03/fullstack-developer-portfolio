
package com.kavya.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kavya.portfolio.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderByIdAsc();
    boolean existsByNameIgnoreCase(String name);
}
