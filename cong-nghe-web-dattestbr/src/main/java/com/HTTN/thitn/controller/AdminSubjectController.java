package com.HTTN.thitn.controller;
import com.HTTN.thitn.dto.Request.SubjectRequest;
import com.HTTN.thitn.dto.Response.SubjectResponse;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin/subjects")

public class AdminSubjectController {
    //admin thêm, sửa, xóa subject, chấp nhận, từ chối môn học được đưa lên,gán, gỡ giáo viên khỏi môn học
    @Autowired
    private SubjectService subjectService;

    @GetMapping("/pending")
    public ResponseEntity<List<SubjectResponse>> getPendingSubjects() {
        List<Subject> pendingSubjects = subjectService.getSubjectsByStatus(0);
        List<SubjectResponse> response = pendingSubjects.stream()
                .map(SubjectResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approveSubject(@PathVariable Long id) {
        subjectService.approveSubject(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> rejectSubject(@PathVariable Long id) {
        subjectService.rejectSubject(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{subjectId}/assign-teacher/{teacherId}")
    public ResponseEntity<Void> assignTeacher(@PathVariable Long subjectId, @PathVariable Long teacherId) {
        subjectService.assignTeacherToSubject(subjectId, teacherId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{subjectId}/remove-teacher/{teacherId}")
    public ResponseEntity<Void> removeTeacher(@PathVariable Long subjectId, @PathVariable Long teacherId) {
        subjectService.removeTeacherFromSubject(subjectId, teacherId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{subjectId}/teachers")
    public ResponseEntity<List<User>> getTeachersForSubject(@PathVariable Integer subjectId) {
        List<User> teachers = subjectService.getTeachersForSubject(subjectId);
        return ResponseEntity.ok(teachers);
    }

    @PostMapping
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setStatus(1);
        Subject createdSubject = subjectService.createSubject(subject);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SubjectResponse(createdSubject));
    }

    @PutMapping("/{id}")

    public ResponseEntity<SubjectResponse> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectRequest request) {
        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        Subject updatedSubject = subjectService.updateSubject(id, subject);
        return ResponseEntity.ok(new SubjectResponse(updatedSubject));
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
    //admin thêm,xóa,tìm học sinh từ môn học
    @PostMapping("/{subjectId}/students/{studentId}")
    public ResponseEntity<?> addStudentToSubject(@PathVariable Long subjectId, @PathVariable Long studentId) {
        boolean added = subjectService.addStudentToSubject(subjectId, studentId);
        if (added) {
            return ResponseEntity.ok().body("Học sinh đã được thêm vào môn học.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy môn học hoặc học sinh.");
        }
    }

    @DeleteMapping("/{subjectId}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromSubject(@PathVariable Long subjectId, @PathVariable Long studentId) {
        boolean removed = subjectService.removeStudentFromSubject(subjectId, studentId);
        if (removed) {
            return ResponseEntity.ok().body("Học sinh đã được xóa khỏi môn học.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy môn học hoặc học sinh.");
        }
    }

    @GetMapping("/{subjectId}/students")
    public ResponseEntity<?> getStudentsInSubject(@PathVariable Long subjectId) {
        List<User> students = subjectService.getStudentsInSubject(subjectId);
        if (students == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy môn học.");
        }
        return ResponseEntity.ok(students);
    }



}
