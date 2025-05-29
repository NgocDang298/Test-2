package com.HTTN.thitn.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "questions")
@Data
//bảng liên kết câu hỏi, đề thi
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "question_bank_id", nullable = false)
    private QuestionBank questionBank;
}