package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.*;
import com.HTTN.thitn.repository.AnswerRepository;
import com.HTTN.thitn.repository.ChoiceRepository;
import com.HTTN.thitn.repository.QuestionRepository;
import com.HTTN.thitn.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    public Answer createAnswer(Integer submissionId, Integer questionId, Integer choiceId, User user) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with id: " + submissionId));
        if (!submission.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền nộp bài này.");
        }
        if (submission.getStatus() != null && submission.getStatus() == 1) {
            throw new IllegalStateException("Bài thi đã được nộp, không thể chỉnh sửa đáp án.");
        }
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
        boolean questionBelongsToExam = questionRepository.existsByIdAndExamId(questionId, submission.getExam().getId());
        if (!questionBelongsToExam) {
            throw new IllegalArgumentException("Câu hỏi không thuộc đề thi.");
        }
        Choice choice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found with id: " + choiceId));
        if (!choice.getQuestionBank().getId().equals(question.getQuestionBank().getId())) {
            throw new IllegalArgumentException("Choice does not belong to the specified question");
        }
        Answer answer = new Answer();
        answer.setSubmission(submission);
        answer.setQuestion(question);
        answer.setChosenChoice(choice);
        return answerRepository.save(answer);
    }
}
