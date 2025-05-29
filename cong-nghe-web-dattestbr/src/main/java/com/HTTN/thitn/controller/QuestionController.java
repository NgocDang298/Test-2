package com.HTTN.thitn.controller;

import com.HTTN.thitn.entity.Question;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QuestionController {

    @Autowired
    private QuestionService questionService;
    // thêm,xóa,get câu hỏi vào đề
    @PostMapping("/teacher/questions/exam/{examId}/question-bank/{questionBankId}")
    public ResponseEntity<Question> addQuestionToExam(@PathVariable Integer examId,
                                                      @PathVariable Integer questionBankId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Question question = questionService.addQuestionToExam(examId, questionBankId,user);
        return ResponseEntity.status(201).body(question);
    }

    @DeleteMapping("/teacher/questions/exam/{examId}/question/{questionId}")
    public ResponseEntity<Void> removeQuestionFromExam(@PathVariable Long examId,
                                                       @PathVariable Long questionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        questionService.removeQuestionFromExam(examId,questionId,user);
        return ResponseEntity.noContent().build();  // Trả về HTTP status 204 No Content
    }


    @GetMapping("/teacher/questions/exam/{examId}")
    public ResponseEntity<List<Question>> getQuestionsByExam(@PathVariable Integer examId) {
        List<Question> questions = questionService.getQuestionsByExam(examId);
        return ResponseEntity.ok(questions);
    }
    // tạo đề =random câu hỏi
    @PostMapping("/teacher/questions/exam/{examId}/auto-generate")
    public ResponseEntity<String> autoGenerateExam(@PathVariable Integer examId,
                                                   @RequestParam(defaultValue = "10") int numberOfQuestions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        questionService.autoGenerateExam(examId, numberOfQuestions, user);
        return ResponseEntity.ok("Tạo đề thi tự động thành công");
    }
    @PostMapping("/teacher/questions/exam/{examId}/auto-generate/by-difficulty")
    public ResponseEntity<String> autoGenerateExamWithDifficulty(
            @PathVariable Integer examId,
            @RequestBody Map<Integer, Integer> difficultyMap) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        questionService.autoGenerateExamWithDifficulty(examId, difficultyMap, user);
        return ResponseEntity.ok("Tạo đề thi ngẫu nhiên theo độ khó thành công");
    }
    //hs lấy đề thi
    @GetMapping("/student/questions/exam/{examId}")
    public ResponseEntity<List<Question>> getQuestionsByExamForStudent(@PathVariable Integer examId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        List<Question> questions = questionService.getQuestionsByExamForStudent(examId, user);
        return ResponseEntity.ok(questions);
    }

}