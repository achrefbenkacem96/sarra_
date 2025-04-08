package com.example.pidevmicroservice.restcontrollers;

import com.example.pidevmicroservice.dto.PerformanceDTO;
import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.entities.Performance;
import com.example.pidevmicroservice.services.AgenceService;
import com.example.pidevmicroservice.services.ExportService;
import com.example.pidevmicroservice.services.PerformanceService;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.InputStreamResource;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;
    
    @Autowired
    private AgenceService agenceService;
    
    @Autowired
    private ExportService exportService;

    // Get all performances
    @GetMapping("/all")
    public ResponseEntity<List<PerformanceDTO>> getAllPerformances() {
        List<PerformanceDTO> performances = performanceService.getAllPerformances();
        return ResponseEntity.ok(performances);
    }

    // Get performance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Performance> getPerformanceById(@PathVariable Long id) {
        Optional<Performance> performance = performanceService.getPerformanceById(id);
        return performance.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get performances by agency
    @GetMapping("/byAgence/{agenceId}")
    public ResponseEntity<List<PerformanceDTO>> getPerformancesByAgence(@PathVariable Long agenceId) {
        List<PerformanceDTO> performances = performanceService.getPerformancesByAgenceId(agenceId);
        return ResponseEntity.ok(performances);
    }

    // Create performance
    @PostMapping("/add")
    public ResponseEntity<Performance> createPerformance(@RequestBody Map<String, Object> performanceData) {
        try {
            Performance performance = new Performance();
            
            // Set basic fields
            if (performanceData.containsKey("chiffreAffaire")) {
                performance.setChiffreAffaire(Double.parseDouble(performanceData.get("chiffreAffaire").toString()));
            }
            
            if (performanceData.containsKey("nombreContrats")) {
                performance.setNombreContrats(Integer.parseInt(performanceData.get("nombreContrats").toString()));
            }
            
            if (performanceData.containsKey("dateDebut")) {
                performance.setDateDebut(java.time.LocalDate.parse(performanceData.get("dateDebut").toString()));
            }
            
            if (performanceData.containsKey("dateFin")) {
                performance.setDateFin(java.time.LocalDate.parse(performanceData.get("dateFin").toString()));
            }
            
            // Handle Agence - could be an ID or a full object
            if (performanceData.containsKey("agence")) {
                Object agenceData = performanceData.get("agence");
                
                if (agenceData instanceof Integer || agenceData instanceof Long || agenceData instanceof String) {
                    // Handle case where agence is just an ID
                    Long agenceId = Long.valueOf(agenceData.toString());
                    Optional<Agence> agence = agenceService.getAgenceById(agenceId);
                    if (agence.isPresent()) {
                        performance.setAgence(agence.get());
                    }
                } else if (agenceData instanceof Map) {
                    // Handle case where agence is a full object
                    Map<String, Object> agenceMap = (Map<String, Object>) agenceData;
                    if (agenceMap.containsKey("idAgence")) {
                        Long agenceId = Long.valueOf(agenceMap.get("idAgence").toString());
                        Optional<Agence> agence = agenceService.getAgenceById(agenceId);
                        if (agence.isPresent()) {
                            performance.setAgence(agence.get());
                        }
                    }
                }
            }
            
            Performance newPerformance = performanceService.createPerformance(performance);
            System.out.println("Created new performance with ID: " + newPerformance.getIdPerformance());
            return ResponseEntity.ok(newPerformance);
        } catch (Exception e) {
            System.out.println("Error creating performance: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Update performance
    @PutMapping("/update/{id}")
    public ResponseEntity<Performance> updatePerformance(@PathVariable Long id, @RequestBody Map<String, Object> performanceData) 
    {
        try {
            Optional<Performance> existingPerformanceOpt = performanceService.getPerformanceById(id);
            if (!existingPerformanceOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Performance performance = existingPerformanceOpt.get();
            
            // Update basic fields
            if (performanceData.containsKey("chiffreAffaire")) {
                performance.setChiffreAffaire(Double.parseDouble(performanceData.get("chiffreAffaire").toString()));
            }
            
            if (performanceData.containsKey("nombreContrats")) {
                performance.setNombreContrats(Integer.parseInt(performanceData.get("nombreContrats").toString()));
            }
            
            if (performanceData.containsKey("dateDebut")) {
                performance.setDateDebut(java.time.LocalDate.parse(performanceData.get("dateDebut").toString()));
            }
            
            if (performanceData.containsKey("dateFin")) {
                performance.setDateFin(java.time.LocalDate.parse(performanceData.get("dateFin").toString()));
            }
            
            // Handle Agence - could be an ID or a full object
            if (performanceData.containsKey("agence")) {
                Object agenceData = performanceData.get("agence");
                
                if (agenceData instanceof Integer || agenceData instanceof Long || agenceData instanceof String) {
                    // Handle case where agence is just an ID
                    Long agenceId = Long.valueOf(agenceData.toString());
                    Optional<Agence> agence = agenceService.getAgenceById(agenceId);
                    if (agence.isPresent()) {
                        performance.setAgence(agence.get());
                    }
                } else if (agenceData instanceof Map) {
                    // Handle case where agence is a full object
                    Map<String, Object> agenceMap = (Map<String, Object>) agenceData;
                    if (agenceMap.containsKey("idAgence")) {
                        Long agenceId = Long.valueOf(agenceMap.get("idAgence").toString());
                        Optional<Agence> agence = agenceService.getAgenceById(agenceId);
                        if (agence.isPresent()) {
                            performance.setAgence(agence.get());
                        }
                    }
                }
            }
            
            Performance updatedPerformance = performanceService.updatePerformance(performance);
            System.out.println("Updated performance with ID: " + updatedPerformance.getIdPerformance());
            return ResponseEntity.ok(updatedPerformance);
        } catch (Exception e) {
            System.out.println("Error updating performance: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete performance
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePerformance(@PathVariable Long id) {
        if (!performanceService.getPerformanceById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            performanceService.deletePerformance(id);
            System.out.println("Deleted performance with ID: " + id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting performance: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Export performances to Excel
    @GetMapping("/exportExcel")
    public ResponseEntity<InputStreamResource> exportPerformancesToExcel() throws IOException {
        List<Performance> performances = performanceService.getAllPerformances().stream()
                .map(dto -> {
                    Performance performance = new Performance();
                    performance.setIdPerformance(dto.getIdPerformance());
                    performance.setChiffreAffaire(dto.getChiffreAffaire());
                    performance.setNombreContrats(dto.getNombreContrats());
                    performance.setDateDebut(dto.getDateDebut());
                    performance.setDateFin(dto.getDateFin());
                    performance.setAgence(agenceService.getAgenceById(dto.getAgenceId()).orElse(null));
                    return performance;
                })
                .collect(Collectors.toList());
        
        ByteArrayInputStream in = exportService.performancesToExcel(performances);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=performances.xlsx");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(in));
    }

    // Export performances to PDF
    @GetMapping("/exportPdf")
    public ResponseEntity<InputStreamResource> exportPerformancesToPdf() throws DocumentException {
        List<Performance> performances = performanceService.getAllPerformances().stream()
                .map(dto -> {
                    Performance performance = new Performance();
                    performance.setIdPerformance(dto.getIdPerformance());
                    performance.setChiffreAffaire(dto.getChiffreAffaire());
                    performance.setNombreContrats(dto.getNombreContrats());
                    performance.setDateDebut(dto.getDateDebut());
                    performance.setDateFin(dto.getDateFin());
                    performance.setAgence(agenceService.getAgenceById(dto.getAgenceId()).orElse(null));
                    return performance;
                })
                .collect(Collectors.toList());
        
        ByteArrayInputStream in = exportService.performancesToPdf(performances);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=performances.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    // Generate statistics
    @GetMapping("/statistics")
    public ResponseEntity<InputStreamResource> generateStatistics() throws DocumentException {
        List<Performance> performances = performanceService.getAllPerformances().stream()
                .map(dto -> {
                    Performance performance = new Performance();
                    performance.setIdPerformance(dto.getIdPerformance());
                    performance.setChiffreAffaire(dto.getChiffreAffaire());
                    performance.setNombreContrats(dto.getNombreContrats());
                    performance.setDateDebut(dto.getDateDebut());
                    performance.setDateFin(dto.getDateFin());
                    performance.setAgence(agenceService.getAgenceById(dto.getAgenceId()).orElse(null));
                    return performance;
                })
                .collect(Collectors.toList());
        
        ByteArrayInputStream in = exportService.performancesStatisticsToPdf(performances);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=statistiques_performances.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}