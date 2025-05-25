package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.EssayAnswer;
import com.HTTN.thitn.entity.Question;
import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.repository.EssayAnswerRepository;
import com.HTTN.thitn.repository.QuestionRepository;
import com.HTTN.thitn.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EssayAnswerService {

    @Autowired
    private EssayAnswerRepository essayAnswerRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public EssayAnswer createEssayAnswer(Integer submissionId, Integer questionId, String answerText, String userRole) {
        if (!userRole.equals("student")) {
            throw new SecurityException("Only students can submit essay answers");
        }
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with id: " + submissionId));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
        if (!question.getQuestionBank().getQuestionType().equals("short_answer")) {
            throw new IllegalArgumentException("Essay answers are only allowed for short_answer questions");
        }
        EssayAnswer essayAnswer = new EssayAnswer();
        essayAnswer.setSubmission(submission);
        essayAnswer.setQuestion(question);
        essayAnswer.setAnswerText(answerText);
        return essayAnswerRepository.save(essayAnswer);
    }
}