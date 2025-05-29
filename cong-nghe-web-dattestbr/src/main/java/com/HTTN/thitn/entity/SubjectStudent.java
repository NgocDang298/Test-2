package com.HTTN.thitn.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@IdClass(SubjectStudentId.class)
@Table(name = "subject_students")
public class SubjectStudent {

    @Id
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Id
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    public SubjectStudent() {}

    public SubjectStudent(Subject subject, User student) {
        this.subject = subject;
        this.student = student;
    }
}
