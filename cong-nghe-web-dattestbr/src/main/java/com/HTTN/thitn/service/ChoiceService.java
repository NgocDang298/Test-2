package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Choice;
import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.repository.ChoiceRepository;
import com.HTTN.thitn.repository.QuestionBankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class ChoiceService {

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private QuestionBankRepository questionBankRepository;

    public Choice createChoice(Integer questionBankId, Choice choice, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can create choices");
        }
        QuestionBank questionBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        if (!questionBank.getQuestionType().equals("multiple_choice") && !questionBank.getQuestionType().equals("true_false")) {
            throw new IllegalArgumentException("Choices are only allowed for multiple_choice or true_false questions");
        }
        choice.setQuestionBank(questionBank);
        return choiceRepository.save(choice);
    }

    public Choice updateChoice(Integer choiceId, Choice choice, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can update choices");
        }
        Choice existingChoice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found with id: " + choiceId));
        existingChoice.setChoiceText(choice.getChoiceText());
        existingChoice.setIsCorrect(choice.getIsCorrect());
        return choiceRepository.save(existingChoice);
    }

    public void deleteChoice(Integer choiceId, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can delete choices");
        }
        Choice choice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found with id: " + choiceId));
        choiceRepository.delete(choice);
    }

    public List<Choice> getChoicesByQuestion(Integer questionBankId) {
        QuestionBank questionBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        return choiceRepository.findByQuestionBank(questionBank);
    }
}