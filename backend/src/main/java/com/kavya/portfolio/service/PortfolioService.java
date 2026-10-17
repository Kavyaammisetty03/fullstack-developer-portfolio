
package com.kavya.portfolio.service;

import org.springframework.stereotype.Service;
import com.kavya.portfolio.entity.Portfolio;
import com.kavya.portfolio.repository.PortfolioRepository;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public PortfolioService(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    public Portfolio getPortfolio() {
        Portfolio portfolio =
                portfolioRepository.findFirstByOrderByIdAsc();

        if (portfolio == null) {
            portfolio = new Portfolio(
                "Kavya Ammisetty",
                "Java Full Stack Developer",
                "",
                "Aspiring Java Full Stack Developer passionate about "
                + "building secure, scalable web applications."
            );

            portfolio = portfolioRepository.save(portfolio);
        }

        return portfolio;
    }
}
