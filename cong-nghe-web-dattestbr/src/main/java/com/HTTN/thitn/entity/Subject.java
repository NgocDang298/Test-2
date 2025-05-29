package com.HTTN.thitn.entity;

import lombok.Data;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    private String description;
    @Column(name = "status", nullable = false)
    private Integer status = 0;  // 0 là 'PENDING', 1 là 'APPROVED', 2 là 'REJECTED'

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @ManyToMany
    @JoinTable(
            name = "subject_teachers",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> teachers = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "subject_students",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> students = new HashSet<>();


}