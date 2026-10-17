
package com.kavya.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kavya.portfolio.entity.Portfolio;

public interface PortfolioRepository
        extends JpaRepository<Portfolio, Long> {

    Portfolio findFirstByOrderByIdAsc();
}
