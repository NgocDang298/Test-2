package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.SubjectTeacher;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.SubjectRepository;
import com.HTTN.thitn.repository.SubjectTeacherRepository;
import com.HTTN.thitn.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectTeacherRepository subjectTeacherRepository;

    public Subject createSubject(Subject subject) {
        if (subjectRepository.existsByName(subject.getName())) {
            throw new IllegalArgumentException("Subject name already exists");
        }
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Integer id, Subject subject) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));

        if (!existingSubject.getName().equals(subject.getName()) && subjectRepository.existsByName(subject.getName())) {
            throw new IllegalArgumentException("Subject name already exists");
        }

        existingSubject.setName(subject.getName());
        existingSubject.setDescription(subject.getDescription());
        return subjectRepository.save(existingSubject);
    }

    public void deleteSubject(Integer id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));
        subjectRepository.delete(subject);
    }

    public Subject getSubjectById(Integer id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Phương thức để thêm giáo viên vào môn học
    public void assignTeacherToSubject(Integer subjectId, Integer teacherId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + subjectId));

        User teacher = userRepository.findById(Long.valueOf(teacherId))
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        if (!teacher.hasRole("TEACHER")) {
            throw new IllegalArgumentException("User is not a teacher");
        }
        if (subject.getStatus() == 0) {
            throw new IllegalArgumentException("Môn học đang trong trạng thái PENDING");
        }
        if (subject.getStatus() == 2) {
            throw new IllegalArgumentException("Môn học bị REJECTED");
        }
        SubjectTeacher subjectTeacher = new SubjectTeacher(subject, teacher);
         subjectTeacherRepository.save(subjectTeacher);
    }

    // Phương thức để xóa giáo viên khỏi môn học
    public void removeTeacherFromSubject(Integer subjectId, Integer teacherId) {
        SubjectTeacher subjectTeacher = subjectTeacherRepository.findBySubjectIdAndTeacherId(subjectId, teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not assigned to this subject"));

        subjectTeacherRepository.delete(subjectTeacher);
    }

    // Phương thức để lấy tất cả giáo viên của môn học
    public List<User> getTeachersForSubject(Integer subjectId) {
        return subjectTeacherRepository.findTeachersBySubjectId(subjectId);
    }

    public void approveSubject(Integer id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        subject.setStatus(1);  // Gán trạng thái APPROVED (1)
        subjectRepository.save(subject);
    }

    public void rejectSubject(Integer id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        subject.setStatus(2);  // Gán trạng thái REJECTED (2)
        subjectRepository.save(subject);
    }
    public List<Subject> getSubjectsByStatus(int status) {
        return subjectRepository.findByStatus(status);
    }
    public boolean addStudentToSubject(Integer subjectId, Long studentId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (subjectOpt.isEmpty() || studentOpt.isEmpty()) {
            return false;
        }

        Subject subject = subjectOpt.get();
        User student = studentOpt.get();

        // Kiểm tra xem user có role STUDENT hay không
        if (!student.hasRole("STUDENT")) {
            return false; // hoặc ném exception nếu muốn
        }

        // Thêm học sinh vào môn học
        subject.getStudents().add(student);
        subjectRepository.save(subject);
        return true;
    }
    public boolean removeStudentFromSubject(Integer subjectId, Long studentId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (subjectOpt.isEmpty() || studentOpt.isEmpty()) {
            return false;
        }
        Subject subject = subjectOpt.get();
        User student = studentOpt.get();
        boolean removed = subject.getStudents().remove(student);
        if (removed) {
            subjectRepository.save(subject);
        }
        return removed;
    }

    public List<User> getStudentsInSubject(Integer subjectId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            return null;
        }
        Subject subject = subjectOpt.get();
        return new ArrayList<>(subject.getStudents());
    }

    public List<Subject> getSubjectsForStudent(Long studentId) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return Collections.emptyList();
        }
        User student = studentOpt.get();
        return new ArrayList<>(student.getSubjects());
    }



}
