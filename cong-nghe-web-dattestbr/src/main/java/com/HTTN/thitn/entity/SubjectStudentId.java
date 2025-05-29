package com.HTTN.thitn.entity;

import java.io.Serializable;
import java.util.Objects;

public class SubjectStudentId implements Serializable {
    private Long subject;
    private Long student;

    public SubjectStudentId() {}

    public SubjectStudentId(Long subject, Long student) {
        this.subject = subject;
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SubjectStudentId)) return false;
        SubjectStudentId that = (SubjectStudentId) o;
        return Objects.equals(subject, that.subject) && Objects.equals(student, that.student);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subject, student);
    }
}

