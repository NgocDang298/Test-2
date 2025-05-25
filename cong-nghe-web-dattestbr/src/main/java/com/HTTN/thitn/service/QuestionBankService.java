package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.QuestionBankRepository;
import com.HTTN.thitn.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class QuestionBankService {

    @Autowired
    private QuestionBankRepository questionBankRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public QuestionBank createQuestion(QuestionBank question, User createdBy, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can create questions");
        }
        validateQuestion(question);
        Subject subject = subjectRepository.findById(question.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + question.getSubject().getId()));
        question.setSubject(subject);
        question.setCreatedBy(createdBy);
        return questionBankRepository.save(question);
    }

    public QuestionBank updateQuestion(Integer id, QuestionBank question, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can update questions");
        }
        validateQuestion(question);
        QuestionBank existingQuestion = questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
        Subject subject = subjectRepository.findById(question.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + question.getSubject().getId()));
        existingQuestion.setSubject(subject);
        existingQuestion.setQuestionText(question.getQuestionText());
        existingQuestion.setQuestionType(question.getQuestionType());
        existingQuestion.setDifficulty(question.getDifficulty());
        return questionBankRepository.save(existingQuestion);
    }

    public void deleteQuestion(Integer id, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can delete questions");
        }
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
        questionBankRepository.delete(question);
    }

    public QuestionBank getQuestionById(Integer id) {
        return questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
    }

    public List<QuestionBank> getQuestionsBySubject(Integer subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + subjectId));
        return questionBankRepository.findBySubject(subject);
    }

    private void validateQuestion(QuestionBank question) {
        if (!List.of("multiple_choice", "true_false", "short_answer").contains(question.getQuestionType())) {
            throw new IllegalArgumentException("Invalid question type");
        }
        if (question.getDifficulty() < 1 || question.getDifficulty() > 3) {
            throw new IllegalArgumentException("Difficulty must be between 1 and 3");
        }
    }
}