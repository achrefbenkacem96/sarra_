package com.example.pidevmicroservice.services;

import com.example.pidevmicroservice.dto.AgencePerformanceDTO;
import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.entities.Performance;
import com.example.pidevmicroservice.repositories.AgenceRepository;
import com.example.pidevmicroservice.repositories.PerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private PerformanceRepository performanceRepository;
    
    @Autowired
    private AgenceRepository agenceRepository;
    
    /**
     * Récupère les N meilleures agences par chiffre d'affaires
     */
    public List<AgencePerformanceDTO> getTopAgencesByRevenue(int limit, LocalDate startDate, LocalDate endDate) {
        System.out.println("Service: Getting top agencies by revenue");
        List<Agence> allAgences = agenceRepository.findAll();
        System.out.println("Total agencies found: " + allAgences.size());
        
        if (allAgences.isEmpty()) {
            return new ArrayList<>(); // Return empty list if no agencies exist
        }
        
        // Get all performances
        List<Performance> allPerformances = performanceRepository.findAll();
        System.out.println("Total performances found: " + allPerformances.size());
        
        // If no date filter is applied, create a dummy DTO with all agencies
        if (startDate == null || endDate == null) {
            System.out.println("No date filter applied, including all performances");
            startDate = LocalDate.now().minusYears(10); // Default to 10 years ago
            endDate = LocalDate.now().plusYears(1);     // Default to 1 year in future
        }
        
        final LocalDate finalStartDate = startDate;
        final LocalDate finalEndDate = endDate;
        
        List<Performance> performances = allPerformances.stream()
                .filter(p -> {
                    // Print debug info for each performance
                    System.out.println("Performance ID: " + p.getIdPerformance() + 
                                     ", agence: " + (p.getAgence() != null ? p.getAgence().getIdAgence() : "null") +
                                     ", dateDebut: " + p.getDateDebut() + 
                                     ", dateFin: " + p.getDateFin());
                    
                    // More lenient date filtering
                    boolean isInRange = true;
                    
                    if (p.getDateDebut() != null && finalStartDate != null) {
                        isInRange = isInRange && (p.getDateDebut().isEqual(finalStartDate) || 
                                                 p.getDateDebut().isAfter(finalStartDate));
                    }
                    
                    if (p.getDateFin() != null && finalEndDate != null) {
                        isInRange = isInRange && (p.getDateFin().isEqual(finalEndDate) || 
                                                 p.getDateFin().isBefore(finalEndDate));
                    }
                    
                    System.out.println("Is in date range: " + isInRange);
                    return isInRange;
                })
                .collect(Collectors.toList());
        
        System.out.println("Filtered performances: " + performances.size());
        
        // Group performances by agency
        Map<Long, List<Performance>> performancesByAgence = performances.stream()
                .filter(p -> p.getAgence() != null) // Make sure agency is not null
                .collect(Collectors.groupingBy(p -> p.getAgence().getIdAgence()));
        
        System.out.println("Agencies with performances: " + performancesByAgence.size());

        List<AgencePerformanceDTO> result = new ArrayList<>();

        // Create DTOs for all agencies, even those without performances
        for (Agence agence : allAgences) {
            List<Performance> agencePerformances = performancesByAgence.getOrDefault(agence.getIdAgence(), new ArrayList<>());
            
            double totalRevenue = 0;
            int totalContracts = 0;
            
            // Calculate totals if performances exist
            if (!agencePerformances.isEmpty()) {
                totalRevenue = agencePerformances.stream()
                        .mapToDouble(Performance::getChiffreAffaire)
                        .sum();
                
                totalContracts = agencePerformances.stream()
                        .mapToInt(Performance::getNombreContrats)
                        .sum();
            }
            
            AgencePerformanceDTO dto = new AgencePerformanceDTO(
                    agence.getIdAgence(),
                    agence.getNomAgence(),
                    agence.getVille(),
                    totalRevenue,
                    totalContracts,
                    startDate,
                    endDate
            );
            
            result.add(dto);
            System.out.println("Added to result: " + agence.getNomAgence() + 
                            " - Revenue: " + totalRevenue + 
                            ", Contracts: " + totalContracts);
        }

        // Sort by revenue and limit the result
        List<AgencePerformanceDTO> finalResult = result.stream()
                .sorted(Comparator.comparingDouble(AgencePerformanceDTO::getChiffreAffaireTotal).reversed())
                .limit(result.isEmpty() ? 0 : Math.min(limit, result.size()))
                .collect(Collectors.toList());
                
        System.out.println("Final result size: " + finalResult.size());
        return finalResult;
    }

    /**
     * Récupère les N meilleures agences par nombre de contrats
     */
    public List<AgencePerformanceDTO> getTopAgencesByContracts(int limit, LocalDate startDate, LocalDate endDate) {
        System.out.println("Service: Getting top agencies by contracts");
        List<Agence> allAgences = agenceRepository.findAll();
        System.out.println("Total agencies found: " + allAgences.size());
        
        if (allAgences.isEmpty()) {
            return new ArrayList<>(); // Return empty list if no agencies exist
        }
        
        // Get all performances
        List<Performance> allPerformances = performanceRepository.findAll();
        System.out.println("Total performances found: " + allPerformances.size());
        
        // If no date filter is applied, create a dummy DTO with all agencies
        if (startDate == null || endDate == null) {
            System.out.println("No date filter applied, including all performances");
            startDate = LocalDate.now().minusYears(10); // Default to 10 years ago
            endDate = LocalDate.now().plusYears(1);     // Default to 1 year in future
        }
        
        final LocalDate finalStartDate = startDate;
        final LocalDate finalEndDate = endDate;
        
        List<Performance> performances = allPerformances.stream()
                .filter(p -> {
                    // Print debug info for each performance
                    System.out.println("Performance ID: " + p.getIdPerformance() + 
                                     ", agence: " + (p.getAgence() != null ? p.getAgence().getIdAgence() : "null") +
                                     ", dateDebut: " + p.getDateDebut() + 
                                     ", dateFin: " + p.getDateFin());
                    
                    // More lenient date filtering
                    boolean isInRange = true;
                    
                    if (p.getDateDebut() != null && finalStartDate != null) {
                        isInRange = isInRange && (p.getDateDebut().isEqual(finalStartDate) || 
                                                 p.getDateDebut().isAfter(finalStartDate));
                    }
                    
                    if (p.getDateFin() != null && finalEndDate != null) {
                        isInRange = isInRange && (p.getDateFin().isEqual(finalEndDate) || 
                                                 p.getDateFin().isBefore(finalEndDate));
                    }
                    
                    System.out.println("Is in date range: " + isInRange);
                    return isInRange;
                })
                .collect(Collectors.toList());
        
        System.out.println("Filtered performances: " + performances.size());
        
        // Group performances by agency
        Map<Long, List<Performance>> performancesByAgence = performances.stream()
                .filter(p -> p.getAgence() != null) // Make sure agency is not null
                .collect(Collectors.groupingBy(p -> p.getAgence().getIdAgence()));
        
        System.out.println("Agencies with performances: " + performancesByAgence.size());

        List<AgencePerformanceDTO> result = new ArrayList<>();

        // Create DTOs for all agencies, even those without performances
        for (Agence agence : allAgences) {
            List<Performance> agencePerformances = performancesByAgence.getOrDefault(agence.getIdAgence(), new ArrayList<>());
            
            double totalRevenue = 0;
            int totalContracts = 0;
            
            // Calculate totals if performances exist
            if (!agencePerformances.isEmpty()) {
                totalRevenue = agencePerformances.stream()
                        .mapToDouble(Performance::getChiffreAffaire)
                        .sum();
                
                totalContracts = agencePerformances.stream()
                        .mapToInt(Performance::getNombreContrats)
                        .sum();
            }
            
            AgencePerformanceDTO dto = new AgencePerformanceDTO(
                    agence.getIdAgence(),
                    agence.getNomAgence(),
                    agence.getVille(),
                    totalRevenue,
                    totalContracts,
                    startDate,
                    endDate
            );
            
            result.add(dto);
            System.out.println("Added to result: " + agence.getNomAgence() + 
                            " - Revenue: " + totalRevenue + 
                            ", Contracts: " + totalContracts);
        }

        // Sort by number of contracts and limit the result
        List<AgencePerformanceDTO> finalResult = result.stream()
                .sorted(Comparator.comparingInt(AgencePerformanceDTO::getNombreContratsTotal).reversed())
                .limit(result.isEmpty() ? 0 : Math.min(limit, result.size()))
                .collect(Collectors.toList());
                
        System.out.println("Final result size: " + finalResult.size());
        return finalResult;
    }

    /**
     * Récupère les performances d'une agence spécifique
     */
    public AgencePerformanceDTO getAgencePerformance(Long idAgence, LocalDate startDate, LocalDate endDate) {
        System.out.println("Service: Getting agency performance for ID " + idAgence);
        
        // Find the agency
        Agence agence = agenceRepository.findById(idAgence).orElse(null);
        if (agence == null) {
            System.out.println("Agency not found with ID: " + idAgence);
            return new AgencePerformanceDTO(idAgence, "Unknown", "", 0, 0, startDate, endDate);
        }
        
        System.out.println("Agency found: " + agence.getNomAgence());
        
        // If no date filter is applied, create a dummy DTO with all agencies
        if (startDate == null || endDate == null) {
            System.out.println("No date filter applied, including all performances");
            startDate = LocalDate.now().minusYears(10); // Default to 10 years ago
            endDate = LocalDate.now().plusYears(1);     // Default to 1 year in future
        }
        
        final LocalDate finalStartDate = startDate;
        final LocalDate finalEndDate = endDate;
        
        // Get all performances for this agency
        List<Performance> allPerformances = performanceRepository.findAllWithAgence().stream()
                .filter(p -> p.getAgence() != null && p.getAgence().getIdAgence().equals(idAgence))
                .collect(Collectors.toList());
                
        System.out.println("Total performances found for agency: " + allPerformances.size());
        
        List<Performance> performances = allPerformances.stream()
                .filter(p -> {
                    // Print debug info for each performance
                    System.out.println("Performance ID: " + p.getIdPerformance() + 
                                     ", dateDebut: " + p.getDateDebut() + 
                                     ", dateFin: " + p.getDateFin());
                    
                    // More lenient date filtering
                    boolean isInRange = true;
                    
                    if (p.getDateDebut() != null && finalStartDate != null) {
                        isInRange = isInRange && (p.getDateDebut().isEqual(finalStartDate) || 
                                                 p.getDateDebut().isAfter(finalStartDate));
                    }
                    
                    if (p.getDateFin() != null && finalEndDate != null) {
                        isInRange = isInRange && (p.getDateFin().isEqual(finalEndDate) || 
                                                 p.getDateFin().isBefore(finalEndDate));
                    }
                    System.out.println("Comparing performance dates: Debut = " + p.getDateDebut() + ", Fin = " + p.getDateFin());
                    System.out.println("Range: Start = " + finalStartDate + ", End = " + finalEndDate);
                    System.out.println("Debut Check: " + (p.getDateDebut().isEqual(finalStartDate) || p.getDateDebut().isAfter(finalStartDate)));
                    System.out.println("Fin Check: " + (p.getDateFin().isEqual(finalEndDate) || p.getDateFin().isBefore(finalEndDate)));

                    System.out.println("Is in date range: " + isInRange);
                    return isInRange;
                })
                .collect(Collectors.toList());
        
        System.out.println("Filtered performances: " + performances.size());

        // Calculate total revenue and contracts
        double totalRevenue = 0;
        int totalContracts = 0;
        
        if (!performances.isEmpty()) {
            totalRevenue = performances.stream()
                    .mapToDouble(Performance::getChiffreAffaire)
                    .sum();
                    
            totalContracts = performances.stream()
                    .mapToInt(Performance::getNombreContrats)
                    .sum();
        }
                
        System.out.println("Total revenue: " + totalRevenue + ", Total contracts: " + totalContracts);
        
        return new AgencePerformanceDTO(
                agence.getIdAgence(),
                agence.getNomAgence(),
                agence.getVille(),
                totalRevenue,
                totalContracts,
                startDate,
                endDate
        );
    }
} 