package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByName(String name);
    List<Subject> findByStatus(int status);

}

