package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam,
                                           @RequestHeader("X-User-Id") Long userId,
                                           @RequestHeader("X-User-Role") String userRole) {
        User createdBy = new User();
        createdBy.setId(userId);
        Exam createdExam = examService.createExam(exam, createdBy, userRole);
        return ResponseEntity.status(201).body(createdExam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Integer id,
                                           @RequestBody Exam exam,
                                           @RequestHeader("X-User-Role") String userRole) {
        Exam updatedExam = examService.updateExam(id, exam, userRole);
        return ResponseEntity.ok(updatedExam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Integer id, @RequestHeader("X-User-Role") String userRole) {
        examService.deleteExam(id, userRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Integer id) {
        Exam exam = examService.getExamById(id);
        return ResponseEntity.ok(exam);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Exam>> getExamsBySubject(@PathVariable Integer subjectId) {
        List<Exam> exams = examService.getExamsBySubject(subjectId);
        return ResponseEntity.ok(exams);
    }
}