package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findBySubject(Subject subject);
    List<Exam> findByCreatedBy(User createdBy);
}