package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Answer;
import com.HTTN.thitn.entity.EssayAnswer;
import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.repository.AnswerRepository;
import com.HTTN.thitn.repository.EssayAnswerRepository;
import com.HTTN.thitn.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class GradingService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private EssayAnswerRepository essayAnswerRepository;

    public Submission gradeSubmission(Integer submissionId, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can grade submissions");
        }
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with id: " + submissionId));

        float score = 0.0f;
        List<Answer> answers = answerRepository.findBySubmission(submission);
        for (Answer answer : answers) {
            if (answer.getChosenChoice() != null && answer.getChosenChoice().getIsCorrect()) {
                score += 1.0f; // Assume 1 point per correct multiple_choice or true_false answer
            }
        }

        // Essay answers require manual grading, score is not updated here
        submission.setScore(score);
        return submissionRepository.save(submission);
    }

    public EssayAnswer gradeEssayAnswer(Integer essayAnswerId, Float score, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can grade essay answers");
        }
        if (score < 0) {
            throw new IllegalArgumentException("Score cannot be negative");
        }
        EssayAnswer essayAnswer = essayAnswerRepository.findById(essayAnswerId)
                .orElseThrow(() -> new EntityNotFoundException("Essay answer not found with id: " + essayAnswerId));
        // Note: EssayAnswer entity does not have a score field yet, this is a placeholder
        // You may need to update the EssayAnswer entity to include a score field
        return essayAnswerRepository.save(essayAnswer);
    }
}