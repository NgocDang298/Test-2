package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Choice;
import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.entity.User;
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

    public Choice createChoice(Integer questionBankId, Choice choice, User user) {
        QuestionBank questionBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        if (questionBank.getQuestionType() < 1 || questionBank.getQuestionType() > 3) {
            throw new IllegalArgumentException("Invalid question type (must be between 1 and 3)");
        }
        if (!questionBank.getCreatedBy().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền thêm lựa chọn cho câu hỏi này.");
        }
        if (questionBank.getQuestionType() == 1 && Boolean.TRUE.equals(choice.getIsCorrect())) {
            long correctCount = choiceRepository.countByQuestionBankAndIsCorrectTrue(questionBank);
            if (correctCount >= 1) {
                throw new IllegalStateException("Câu hỏi multiple choice chỉ được có một đáp án đúng.");
            }
        }

        choice.setQuestionBank(questionBank);
        return choiceRepository.save(choice);
    }

    public Choice updateChoice(Integer choiceId, Choice choice, User user) {
        Choice existingChoice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found with id: " + choiceId));

        QuestionBank questionBank = existingChoice.getQuestionBank();
        if (!questionBank.getCreatedBy().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền sửa lựa chọn này.");
        }

        existingChoice.setChoiceText(choice.getChoiceText());
        existingChoice.setIsCorrect(choice.getIsCorrect());
        return choiceRepository.save(existingChoice);
    }


    public void deleteChoice(Integer choiceId, User user) {
        Choice choice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found with id: " + choiceId));

        QuestionBank questionBank = choice.getQuestionBank();
        if (!questionBank.getCreatedBy().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền xóa lựa chọn này.");
        }

        choiceRepository.delete(choice);
    }


    public List<Choice> getChoicesByQuestion(Integer questionBankId) {
        QuestionBank questionBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        return choiceRepository.findByQuestionBank(questionBank);
    }
}