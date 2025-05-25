package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.Role;
import com.HTTN.thitn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    void delete(User user);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRoles_Name(String roleName);
    List<User> findByRolesContaining(Role role);
    List<User> findByRolesContainingAndFullnameContainingIgnoreCase(Role role, String name);
    Optional<User> findByFullname(String fullname);
    List<User> findByFullnameContainingIgnoreCase(String fullname);
    Optional<User> findByEmail(String email);
    List<User> findByEmailContainingIgnoreCase(String email);
    List<User> findByFullnameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullname, String email);
    List<User> findByRoles_NameAndFullnameContainingIgnoreCase(String roleName, String fullname);
    List<User> findByRoles_NameAndEmailContainingIgnoreCase(String roleName, String email);
    List<User> findByRoles_NameAndFullnameContainingIgnoreCaseOrEmailContainingIgnoreCase(String roleName, String fullname, String email);
}