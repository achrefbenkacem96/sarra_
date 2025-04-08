package com.example.pidevmicroservice.repositories;

import com.example.pidevmicroservice.entities.Agence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenceRepository extends JpaRepository<Agence, Long> {
    //méthodes personnalisées
}