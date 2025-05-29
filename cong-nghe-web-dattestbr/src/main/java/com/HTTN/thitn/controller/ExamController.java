package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Exam createdExam = examService.createExam(exam, user); // hoặc user.getRole() nếu bạn đã map sẵn
        return ResponseEntity.status(201).body(createdExam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Integer id,
                                           @RequestBody Exam exam) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Exam updatedExam = examService.updateExam(id, exam, user);
        return ResponseEntity.ok(updatedExam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        examService.deleteExam(id, user);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Integer id) {
        Exam exam = examService.getExamById(id);
        return ResponseEntity.ok(exam);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Exam>> getExamsBySubject(@PathVariable Long subjectId) {
        List<Exam> exams = examService.getExamsBySubject(subjectId);
        return ResponseEntity.ok(exams);
    }
}