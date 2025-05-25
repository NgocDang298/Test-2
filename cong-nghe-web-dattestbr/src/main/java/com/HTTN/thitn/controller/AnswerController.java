package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Answer;
import com.HTTN.thitn.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @PostMapping("/submission/{submissionId}/question/{questionId}/choice/{choiceId}")
    public ResponseEntity<Answer> createAnswer(@PathVariable Integer submissionId,
                                               @PathVariable Integer questionId,
                                               @PathVariable Integer choiceId,
                                               @RequestHeader("X-User-Role") String userRole) {
        Answer answer = answerService.createAnswer(submissionId, questionId, choiceId, userRole);
        return ResponseEntity.status(201).body(answer);
    }
}