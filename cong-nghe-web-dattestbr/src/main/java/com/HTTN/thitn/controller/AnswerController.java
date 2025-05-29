package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Answer;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;
    // gửi đáp án cho từng câu hỏi
    @PostMapping("/submission/{submissionId}/question/{questionId}/choice/{choiceId}")
    public ResponseEntity<Answer> createAnswer(@PathVariable Integer submissionId,
                                               @PathVariable Integer questionId,
                                               @PathVariable Integer choiceId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        Answer answer = answerService.createAnswer(submissionId, questionId, choiceId, user);
        return ResponseEntity.status(201).body(answer);
    }

}