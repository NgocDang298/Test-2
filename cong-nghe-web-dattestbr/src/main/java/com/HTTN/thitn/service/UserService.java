package com.HTTN.thitn.service;

import com.HTTN.thitn.dto.Request.RegisterRequest;
import com.HTTN.thitn.dto.Request.StudentUpdateRequest;
import com.HTTN.thitn.dto.Request.TeacherUpdateRequest;
import com.HTTN.thitn.dto.Response.UserDTO;
import com.HTTN.thitn.entity.Role;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.RoleRepository;
import com.HTTN.thitn.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public void updateStudentInfo(String username, StudentUpdateRequest request) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy sinh viên với username: " + username));
        if (request.getFullname() != null) {
            student.setFullname(request.getFullname());
        }
        if (request.getEmail() != null) {
            student.setEmail(request.getEmail());
        }
        userRepository.save(student);
    }

    public void updateTeacherInfo(String username, TeacherUpdateRequest request) {
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy giáo viên với username: " + username));
        if (request.getFullname() != null) {
            teacher.setFullname(request.getFullname());
        }
        if (request.getEmail() != null) {
            teacher.setEmail(request.getEmail());
        }
        userRepository.save(teacher);
    }

    public void updateStudentById(Long studentId, StudentUpdateRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy sinh viên với ID: " + studentId));
        userRepository.save(student);
    }

    public void updateTeacherById(Long teacherId, TeacherUpdateRequest request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy giáo viên với ID: " + teacherId));
        userRepository.save(teacher);
    }

    public List<UserDTO> findUsersByRoleName(String roleName) {
        return userRepository.findByRoles_Name(roleName)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsersByRoleNameAndFullName(String roleName, String fullname) {
        return userRepository.findByRoles_NameAndFullnameContainingIgnoreCase(roleName, fullname)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsersByRoleNameAndEmail(String roleName, String email) {
        return userRepository.findByRoles_NameAndEmailContainingIgnoreCase(roleName, email)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }
    public Optional<UserDTO> findUserByFullName(String fullname) {
        return userRepository.findByFullname(fullname).map(this::convertToUserDTO);
    }

    public List<UserDTO> searchUsersByFullName(String fullname) {
        return userRepository.findByFullnameContainingIgnoreCase(fullname)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> findUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToUserDTO);
    }

    public List<UserDTO> searchUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsersByNameOrEmail(String query) {
        return userRepository.findByFullnameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }
    public List<UserDTO> searchUsersByRoleNameAndFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String roleName, String fullname, String email) {
        return userRepository.findByRoles_NameAndFullnameContainingIgnoreCaseOrEmailContainingIgnoreCase(roleName, fullname, email)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public Optional<String> deleteStudentById(Long studentId) {
        Optional<String> response = Optional.empty();
        User student = userRepository.findById(studentId)
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.getName().equals("STUDENT")))
                .orElse(null);

        if (student != null) {
            userRepository.delete(student);
            response = Optional.of("Sinh viên với ID " + studentId + " đã được xóa.");
        }
        return response;
    }

    public Optional<String> deleteTeacherById(Long teacherId) {
        Optional<String> response = Optional.empty();
        User teacher = userRepository.findById(teacherId)
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.getName().equals("TEACHER")))
                .orElse(null);

        if (teacher != null) {
            userRepository.delete(teacher);
            response = Optional.of("Giáo viên với ID " + teacherId + " đã được xóa.");
        }
        return response;
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BadCredentialsException("Mật khẩu cũ không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void registerTeacher(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }

        User newTeacher = new User();
        newTeacher.setUsername(request.getUsername());
        newTeacher.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newTeacher.setFullname(request.getFullname());
        newTeacher.setEmail(request.getEmail());
        Role teacherRole = roleRepository.findByName("TEACHER")
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò TEACHER."));
        Set<Role> roles = new HashSet<>();
        roles.add(teacherRole);
        newTeacher.setRoles(roles);

        userRepository.save(newTeacher);
    }
    public UserDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));
        return convertToUserDTO(user);
    }
}

