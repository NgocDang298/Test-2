package com.HTTN.thitn.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@IdClass(SubjectTeacherId.class)
@Table(name = "subject_teachers")
public class SubjectTeacher {

    @Id
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Id
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    public SubjectTeacher() {}

    public SubjectTeacher(Subject subject, User teacher) {
        this.subject = subject;
        this.teacher = teacher;
    }
}
