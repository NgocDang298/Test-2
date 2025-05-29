package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.GradingService;
import com.HTTN.thitn.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;
    @Autowired
    private GradingService gradingService;
    // ấn bắt đầu làm bài, tạo 1 submission
    @PostMapping("/student/submissions/exam/{examId}")
    public ResponseEntity<Submission> createSubmission(@PathVariable Integer examId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Submission submission = submissionService.createSubmission(examId, user);
        return ResponseEntity.status(201).body(submission);
    }

    @PostMapping("/student/submissions/{submissionId}/submit")
    public ResponseEntity<Submission> submitSubmission(@PathVariable Integer submissionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        submissionService.submitSubmission(submissionId, user);
        Submission gradedSubmission = gradingService.gradeSubmission(submissionId, user);

        return ResponseEntity.ok(gradedSubmission);
    }


    @GetMapping("/teacher/submissions/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Integer id) {
        Submission submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/teacher/submissions/exam/{examId}")
    public ResponseEntity<List<Submission>> getSubmissionsByExam(@PathVariable Integer examId) {
        List<Submission> submissions = submissionService.getSubmissionsByExam(examId);
        return ResponseEntity.ok(submissions);
    }
}
