package com.example.pidevmicroservice.services;

import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.repositories.AgenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgenceService {

    @Autowired
    private AgenceRepository agenceRepository;

    // Créer une agence
    public Agence createAgence(Agence agence) {
        return agenceRepository.save(agence);
    }

    // Lire toutes les agences
    public List<Agence> getAllAgences() {
        return agenceRepository.findAll();
    }

    // Lire une agence par son ID
    public Optional<Agence> getAgenceById(Long id) {
        return agenceRepository.findById(id);
    }

    // Mettre à jour une agence
    public Agence updateAgence(Long id, Agence agenceDetails) {
        Agence agence = agenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agence non trouvée"));
        agence.setNomAgence(agenceDetails.getNomAgence());
        agence.setAdresse(agenceDetails.getAdresse());
        agence.setVille(agenceDetails.getVille());
        agence.setCodePostal(agenceDetails.getCodePostal());
        agence.setTelephone(agenceDetails.getTelephone());
        agence.setEmail(agenceDetails.getEmail());
        agence.setResponsable(agenceDetails.getResponsable());
        agence.setDateCreation(agenceDetails.getDateCreation());
        return agenceRepository.save(agence);
    }

    // Supprimer une agence
    public void deleteAgence(Long id) {
        agenceRepository.deleteById(id);
    }
}