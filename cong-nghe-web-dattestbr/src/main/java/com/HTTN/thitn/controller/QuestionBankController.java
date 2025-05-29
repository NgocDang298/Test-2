package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.QuestionBankService;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QuestionBankController {

    @Autowired
    private QuestionBankService questionBankService;
    //crud câu hỏi
    @PostMapping("/teacher/question-bank")
    public ResponseEntity<Map<String, String>> createQuestion(@RequestBody QuestionBank question) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        QuestionBank createdQuestion = questionBankService.createQuestion(question, user);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/teacher/question-bank/{id}")
    public ResponseEntity<QuestionBank> updateQuestion(@PathVariable Integer id,
                                                       @RequestBody QuestionBank question) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        QuestionBank updatedQuestion = questionBankService.updateQuestion(id, question, user);
        return ResponseEntity.ok(updatedQuestion);
    }


    @DeleteMapping("/teacher/question-bank/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        questionBankService.deleteQuestion(id,user );
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/teacher/question-bank/{id}")
    public ResponseEntity<QuestionBank> getQuestionById(@PathVariable Integer id) {
        QuestionBank question = questionBankService.getQuestionById(id);
        return ResponseEntity.ok(question);
    }
    //Lấy danh sách câu hỏi thuộc một môn học.
    @GetMapping("/teacher/question-bank/subject/{subjectId}")
    public ResponseEntity<List<QuestionBank>> getQuestionsBySubject(@PathVariable Long subjectId) {
        List<QuestionBank> questions = questionBankService.getQuestionsBySubject(subjectId);
        return ResponseEntity.ok(questions);
    }
}
