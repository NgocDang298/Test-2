package com.HTTN.thitn.entity;

import java.io.Serializable;
import java.util.Objects;

public class SubjectTeacherId implements Serializable {
    private Long subject;
    private Long teacher;

    public SubjectTeacherId() {}

    public SubjectTeacherId(Long subject, Long teacher) {
        this.subject = subject;
        this.teacher = teacher;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SubjectTeacherId)) return false;
        SubjectTeacherId that = (SubjectTeacherId) o;
        return Objects.equals(subject, that.subject) &&
                Objects.equals(teacher, that.teacher);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subject, teacher);
    }
}

