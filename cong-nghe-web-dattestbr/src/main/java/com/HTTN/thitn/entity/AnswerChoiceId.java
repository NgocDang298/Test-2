package com.HTTN.thitn.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AnswerChoiceId implements Serializable {
    private Integer answerId;
    private Integer choiceId;

    public AnswerChoiceId() {}

    public AnswerChoiceId(Integer answerId, Integer choiceId) {
        this.answerId = answerId;
        this.choiceId = choiceId;
    }

    // getters, setters, equals, hashCode

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AnswerChoiceId)) return false;
        AnswerChoiceId that = (AnswerChoiceId) o;
        return Objects.equals(answerId, that.answerId) && Objects.equals(choiceId, that.choiceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(answerId, choiceId);
    }
}

