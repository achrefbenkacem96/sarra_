package com.example.pidevmicroservice.restcontrollers;

import com.example.pidevmicroservice.dto.AgencePerformanceDTO;
import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.services.AgenceService;
import com.example.pidevmicroservice.services.ExportService;
import com.example.pidevmicroservice.services.StatisticsService;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;
    
    @Autowired
    private ExportService exportService;
    
    @Autowired
    private AgenceService agenceService;

    // Get top agencies by revenue
    @GetMapping("/top-revenue")
    public ResponseEntity<List<AgencePerformanceDTO>> getTopAgencesByRevenue(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        System.out.println("Getting top agencies by revenue: limit=" + limit + ", startDate=" + startDate + ", endDate=" + endDate);
        List<AgencePerformanceDTO> topAgences = statisticsService.getTopAgencesByRevenue(limit, startDate, endDate);
        System.out.println("Found " + topAgences.size() + " agencies");
        return ResponseEntity.ok(topAgences);
    }

    // Get top agencies by contracts
    @GetMapping("/top-contracts")
    public ResponseEntity<List<AgencePerformanceDTO>> getTopAgencesByContracts(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        System.out.println("Getting top agencies by contracts: limit=" + limit + ", startDate=" + startDate + ", endDate=" + endDate);
        List<AgencePerformanceDTO> topAgences = statisticsService.getTopAgencesByContracts(limit, startDate, endDate);
        System.out.println("Found " + topAgences.size() + " agencies");
        return ResponseEntity.ok(topAgences);
    }

    // Get performance details for a specific agency
    @GetMapping("/agency-performance/{id}")
    public ResponseEntity<AgencePerformanceDTO> getAgencePerformance(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        System.out.println("Getting performance for agency ID " + id + ": startDate=" + startDate + ", endDate=" + endDate);
        AgencePerformanceDTO performance = statisticsService.getAgencePerformance(id, startDate, endDate);
        System.out.println("Performance result: " + performance);
        return ResponseEntity.ok(performance);
    }
    
    // Export all agencies to Excel
    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportAgencesToExcel() throws IOException {
        List<Agence> agences = agenceService.getAllAgences();
        
        ByteArrayInputStream in = exportService.agencesToExcel(agences);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=agences.xlsx");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(in));
    }
    
    // Export statistics to PDF
    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportStatisticsToPdf(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws DocumentException {
        
        List<AgencePerformanceDTO> topRevenueAgences = statisticsService.getTopAgencesByRevenue(limit, startDate, endDate);
        List<AgencePerformanceDTO> topContractsAgences = statisticsService.getTopAgencesByContracts(limit, startDate, endDate);
        
        ByteArrayInputStream in = exportService.statisticsToPdf(topRevenueAgences, topContractsAgences);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=statistiques_agences.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
} 