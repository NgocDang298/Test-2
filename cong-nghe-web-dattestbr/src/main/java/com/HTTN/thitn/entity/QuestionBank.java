package com.HTTN.thitn.entity;

import lombok.Data;
import jakarta.persistence.*;
        import java.time.LocalDateTime;

@Entity
@Table(name = "question_bank")
@Data
public class QuestionBank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false, length = 20)
    private Integer questionType;

    @Column(nullable = false)
    private Integer difficulty;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}