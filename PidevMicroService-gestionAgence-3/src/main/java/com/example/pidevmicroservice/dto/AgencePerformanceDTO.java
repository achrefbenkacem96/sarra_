package com.example.pidevmicroservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencePerformanceDTO {
    private Long idAgence;
    private String nomAgence;
    private String ville;
    private double chiffreAffaireTotal;
    private int nombreContratsTotal;
    private LocalDate dateDebut;
    private LocalDate dateFin;
} 