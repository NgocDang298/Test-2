package com.HTTN.thitn.entity;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import jakarta.persistence.*;
        import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Score must be >= 0.0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Score must be <= 10.0")
    private Float score = 0.0f;
    private LocalDateTime submitTime ;
    private Integer status;
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime = LocalDateTime.now();
}