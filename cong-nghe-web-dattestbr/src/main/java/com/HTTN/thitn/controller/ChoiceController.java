package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Request.ChoiceRequest;
import com.HTTN.thitn.dto.Response.ChoiceResponse;
import com.HTTN.thitn.entity.Choice;
import com.HTTN.thitn.service.ChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/choices")
public class ChoiceController {

    @Autowired
    private ChoiceService choiceService;

    @PostMapping("/question/{questionBankId}")
    public ResponseEntity<ChoiceResponse> createChoice(@PathVariable Integer questionBankId,
                                                       @RequestBody ChoiceRequest request,
                                                       @RequestHeader("X-User-Role") String userRole) {
        Choice choice = new Choice();
        choice.setChoiceText(request.getChoiceText());
        choice.setIsCorrect(request.getIsCorrect());
        Choice created = choiceService.createChoice(questionBankId, choice, userRole);
        return ResponseEntity.status(201).body(new ChoiceResponse(created));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Choice> updateChoice(@PathVariable Integer id,
                                               @RequestBody Choice choice,
                                               @RequestHeader("X-User-Role") String userRole) {
        Choice updatedChoice = choiceService.updateChoice(id, choice, userRole);
        return ResponseEntity.ok(updatedChoice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChoice(@PathVariable Integer id, @RequestHeader("X-User-Role") String userRole) {
        choiceService.deleteChoice(id, userRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/question/{questionBankId}")
    public ResponseEntity<List<Choice>> getChoicesByQuestion(@PathVariable Integer questionBankId) {
        List<Choice> choices = choiceService.getChoicesByQuestion(questionBankId);
        return ResponseEntity.ok(choices);
    }
}