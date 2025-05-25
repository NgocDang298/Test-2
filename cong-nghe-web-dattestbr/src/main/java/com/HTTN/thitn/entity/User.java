package com.HTTN.thitn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String fullname;

    @Column(unique = true, nullable = false)
    private String email;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    private Set<Subject> subjects = new HashSet<>();
    public boolean hasRole(String roleName) {
        return roles.stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase(roleName));
    }
    @ManyToMany(mappedBy = "students")
    @JsonIgnore
    private Set<Subject> enrolledSubjects = new HashSet<>();

}
