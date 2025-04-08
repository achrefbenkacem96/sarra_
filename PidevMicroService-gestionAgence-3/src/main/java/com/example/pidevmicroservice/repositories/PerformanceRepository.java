package com.example.pidevmicroservice.repositories;

import com.example.pidevmicroservice.entities.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    @Query("SELECT p FROM Performance p LEFT JOIN FETCH p.agence")
    List<Performance> findAllWithAgence();
    @Query("SELECT p FROM Performance p LEFT JOIN FETCH p.agence WHERE p.agence.idAgence = :agenceId")
    List<Performance> findByAgenceId(@Param("agenceId") Long agenceId);
}