package com.example.pidevmicroservice.restcontrollers;

import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.services.AgenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/agences")
public class AgenceController {

    @Autowired
    private AgenceService agenceService;

    // Créer une agence
    @PostMapping
    public ResponseEntity<Agence> createAgence(@RequestBody Agence agence) {
        Agence newAgence = agenceService.createAgence(agence);
        return ResponseEntity.ok(newAgence);
    }

    // Lire toutes les agences avec filtrage optionnel
    @GetMapping
    public ResponseEntity<List<Agence>> getAllAgences(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String ville) {
        
        List<Agence> agences = agenceService.getAllAgences();
        
        // Apply search filter if provided
        if (search != null && !search.isEmpty()) {
            final String searchLower = search.toLowerCase();
            agences = agences.stream()
                    .filter(a -> 
                        (a.getNomAgence() != null && a.getNomAgence().toLowerCase().contains(searchLower)) ||
                        (a.getAdresse() != null && a.getAdresse().toLowerCase().contains(searchLower)) ||
                        (a.getVille() != null && a.getVille().toLowerCase().contains(searchLower)) ||
                        (a.getResponsable() != null && a.getResponsable().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        // Apply ville filter if provided
        if (ville != null && !ville.isEmpty()) {
            final String villeLower = ville.toLowerCase();
            agences = agences.stream()
                    .filter(a -> a.getVille() != null && a.getVille().toLowerCase().contains(villeLower))
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(agences);
    }

    // Lire une agence par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Agence> getAgenceById(@PathVariable Long id) {
        Optional<Agence> agence = agenceService.getAgenceById(id);
        return agence.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour une agence
    @PutMapping("/{id}")
    public ResponseEntity<Agence> updateAgence(@PathVariable Long id, @RequestBody Agence agenceDetails) {
        Agence updatedAgence = agenceService.updateAgence(id, agenceDetails);
        return ResponseEntity.ok(updatedAgence);
    }

    // Supprimer une agence
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgence(@PathVariable Long id) {
        agenceService.deleteAgence(id);
        return ResponseEntity.noContent().build();
    }
    
    // Get unique cities for filter dropdown
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<Agence> agences = agenceService.getAllAgences();
        List<String> cities = agences.stream()
                .map(Agence::getVille)
                .filter(ville -> ville != null && !ville.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(cities);
    }
}