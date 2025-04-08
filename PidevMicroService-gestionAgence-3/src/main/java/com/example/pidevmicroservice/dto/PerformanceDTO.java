package com.example.pidevmicroservice.dto;

import com.example.pidevmicroservice.entities.Performance;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceDTO {
    private Long idPerformance;
    private double chiffreAffaire;
    private int nombreContrats;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Long agenceId;       // Add agency ID
    private String nomAgence;   // Keep agency name

    public PerformanceDTO(Performance performance) {
        this.idPerformance = performance.getIdPerformance();
        this.chiffreAffaire = performance.getChiffreAffaire();
        this.nombreContrats = performance.getNombreContrats();
        this.dateDebut = performance.getDateDebut();
        this.dateFin = performance.getDateFin();

        if(performance.getAgence() != null) {
            this.agenceId = performance.getAgence().getIdAgence();
            this.nomAgence = performance.getAgence().getNomAgence();
        }
    }
}