package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/exam/{examId}")
    public ResponseEntity<Submission> createSubmission(@PathVariable Integer examId,
                                                       @RequestHeader("X-User-Id") Long userId,
                                                       @RequestHeader("X-User-Role") String userRole) {
        User user = new User();
        user.setId(userId);
        Submission submission = submissionService.createSubmission(examId, user, userRole);
        return ResponseEntity.status(201).body(submission);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Integer id) {
        Submission submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Submission>> getSubmissionsByExam(@PathVariable Integer examId) {
        List<Submission> submissions = submissionService.getSubmissionsByExam(examId);
        return ResponseEntity.ok(submissions);
    }
}
