package com.example.pidevmicroservice.services;

import com.example.pidevmicroservice.dto.PerformanceDTO;
import com.example.pidevmicroservice.entities.Performance;
import com.example.pidevmicroservice.repositories.PerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    @Autowired
    private PerformanceRepository performanceRepository;

    // Create a performance
    public Performance createPerformance(Performance performance) {
        return performanceRepository.save(performance);
    }

    // Get all performances
    public List<PerformanceDTO> getAllPerformances() {
        List<Performance> performances = performanceRepository.findAllWithAgence();
        return performances.stream()
                .map(PerformanceDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get performances by agency ID
    public List<PerformanceDTO> getPerformancesByAgenceId(Long agenceId) {
        List<Performance> performances = performanceRepository.findByAgenceId(agenceId);
        return performances.stream()
                .map(PerformanceDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get performance by ID
    public Optional<Performance> getPerformanceById(Long id) {
        return performanceRepository.findById(id);
    }

    // Update a performance
    public Performance updatePerformance(Performance performance) {
        return performanceRepository.save(performance);
    }

    // Delete a performance
    public void deletePerformance(Long id) {
        performanceRepository.deleteById(id);
    }
}