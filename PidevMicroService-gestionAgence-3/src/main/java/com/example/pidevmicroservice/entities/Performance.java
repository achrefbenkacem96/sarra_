package com.example.pidevmicroservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPerformance;

    private double chiffreAffaire;
    private int nombreContrats;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "idAgence")
    private Agence agence;
}