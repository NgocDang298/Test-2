package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.Question;
import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.repository.ExamRepository;
import com.HTTN.thitn.repository.QuestionBankRepository;
import com.HTTN.thitn.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionBankRepository questionBankRepository;

    public Question addQuestionToExam(Integer examId, Integer questionBankId, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can add questions to exams");
        }
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        QuestionBank questionBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        Question question = new Question();
        question.setExam(exam);
        question.setQuestionBank(questionBank);
        return questionRepository.save(question);
    }

    public void removeQuestionFromExam(Integer examId, Integer questionId, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can remove questions from exams");
        }
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
        questionRepository.delete(question);
    }

    public List<Question> getQuestionsByExam(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        return questionRepository.findByExam(exam);
    }
}