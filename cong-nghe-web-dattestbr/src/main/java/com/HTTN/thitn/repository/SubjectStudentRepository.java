package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.SubjectStudent;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.SubjectStudentId;
import com.HTTN.thitn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectStudentRepository extends JpaRepository<SubjectStudent, SubjectStudentId> {
    Optional<SubjectStudent> findBySubjectIdAndStudentId(Long subjectId, Long studentId);
    @Query("SELECT ss.subject FROM SubjectStudent ss WHERE ss.student.id = :studentId")
    List<Subject> findSubjectsByStudentId(@Param("studentId") Long studentId);


}
