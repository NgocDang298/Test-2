package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Request.ChoiceRequest;
import com.HTTN.thitn.dto.Response.ChoiceResponse;
import com.HTTN.thitn.entity.Choice;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.security.CustomUserDetails;
import com.HTTN.thitn.service.ChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/choices")
public class ChoiceController {

    @Autowired
    private ChoiceService choiceService;
    // crud các đáp án cho câu hỏi
    @PostMapping("/question/{questionBankId}")
    public ResponseEntity<ChoiceResponse> createChoice(@PathVariable Integer questionBankId,
                                                       @RequestBody ChoiceRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Choice choice = new Choice();
        choice.setChoiceText(request.getChoiceText());
        choice.setIsCorrect(request.getIsCorrect());
        Choice created = choiceService.createChoice(questionBankId, choice, user);
        return ResponseEntity.status(201).body(new ChoiceResponse(created));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Choice> updateChoice(@PathVariable Integer id,
                                               @RequestBody Choice choice) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Choice updatedChoice = choiceService.updateChoice(id, choice, user);
        return ResponseEntity.ok(updatedChoice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChoice(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        choiceService.deleteChoice(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/question/{questionBankId}")
    public ResponseEntity<List<Choice>> getChoicesByQuestion(@PathVariable Integer questionBankId) {
        List<Choice> choices = choiceService.getChoicesByQuestion(questionBankId);
        return ResponseEntity.ok(choices);
    }
}