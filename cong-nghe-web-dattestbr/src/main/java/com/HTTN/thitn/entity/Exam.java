package com.HTTN.thitn.entity;

import lombok.Data;
import jakarta.persistence.*;
        import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    private String description;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Integer duration;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name ="created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}