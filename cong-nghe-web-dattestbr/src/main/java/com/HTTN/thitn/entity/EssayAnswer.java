package com.HTTN.thitn.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "essay_answers")
@Data
public class EssayAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "answer_text", nullable = false)
    private String answerText;

    @Column(name = "score")
    private Float score;

}