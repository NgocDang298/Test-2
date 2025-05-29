package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.GradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grading")
public class GradingController {

    @Autowired
    private GradingService gradingService;

    @PostMapping("/submission/{submissionId}")
    public ResponseEntity<Submission> gradeSubmission(@PathVariable Integer submissionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Submission gradedSubmission = gradingService.gradeSubmission(submissionId, user);
        return ResponseEntity.ok(gradedSubmission);
    }

    @PostMapping("/essay-answer/{essayAnswerId}/score/{score}")
    public ResponseEntity<Void> gradeEssayAnswer(@PathVariable Integer essayAnswerId,
                                                 @PathVariable Float score,
                                                 @RequestHeader("X-User-Role") String userRole) {
        gradingService.gradeEssayAnswer(essayAnswerId, score, userRole);
        return ResponseEntity.ok().build();
    }
}