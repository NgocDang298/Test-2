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
@RequestMapping("/api")
public class SubjectController {
    // giáo viên xử lí với subject, thêm, sửa, tìm

    @Autowired
    private SubjectService subjectService;

    @PostMapping("/teacher/subjects")
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        Subject createdSubject = subjectService.createSubject(subject);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SubjectResponse(createdSubject));
    }

    @PutMapping("/teacher/subjects/{id}")

    public ResponseEntity<SubjectResponse> updateSubject(@PathVariable Integer id, @Valid @RequestBody SubjectRequest request) {
        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        Subject updatedSubject = subjectService.updateSubject(id, subject);
        return ResponseEntity.ok(new SubjectResponse(updatedSubject));
    }


    @GetMapping("/teacher/subjects/{id}")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Integer id) {
        Subject subject = subjectService.getSubjectById(id);
        if (subject == null) {
            // Trả về mã lỗi 404 nếu không tìm thấy subject
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new SubjectResponse(subject));
    }

    @GetMapping("/teacher/subjects")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        List<SubjectResponse> response = subjects.stream()
                .map(SubjectResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
// giáo viên thêm hs vào
    @PostMapping("/teacher/subjects/{subjectId}/students/{studentId}")
    public ResponseEntity<?> addStudentToSubject(@PathVariable Integer subjectId, @PathVariable Long studentId) {
        boolean added = subjectService.addStudentToSubject(subjectId, studentId);
        if (added) {
            return ResponseEntity.ok().body("Học sinh đã được thêm vào môn học.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy môn học hoặc học sinh.");
        }
    }
    @GetMapping("/teacher/subjects/{subjectId}/students")
    public ResponseEntity<?> getStudentsInSubject(@PathVariable Integer subjectId) {
        List<User> students = subjectService.getStudentsInSubject(subjectId);
        if (students == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy môn học.");
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/student/{studentId}/subjects")
    public ResponseEntity<List<SubjectResponse>> getSubjectsForStudent(@PathVariable Long studentId) {
        List<Subject> subjects = subjectService.getSubjectsForStudent(studentId);
        List<SubjectResponse> response = subjects.stream()
                .map(SubjectResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


}
