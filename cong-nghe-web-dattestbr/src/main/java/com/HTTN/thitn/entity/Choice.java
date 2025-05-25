package com.HTTN.thitn.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "choices")
@Data
public class Choice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "question_bank_id", nullable = false)
    private QuestionBank questionBank;

    @Column(name = "choice_text", nullable = false)
    private String choiceText;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;
}