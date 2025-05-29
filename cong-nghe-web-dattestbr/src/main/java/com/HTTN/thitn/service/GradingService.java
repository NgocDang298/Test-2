package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.*;
import com.HTTN.thitn.repository.AnswerRepository;
import com.HTTN.thitn.repository.ChoiceRepository;
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
    private ChoiceRepository choiceRepository;

    @Autowired
    private EssayAnswerRepository essayAnswerRepository;

    public Submission gradeSubmission(Integer submissionId, User user) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with id: " + submissionId));

        // Kiểm tra người dùng có đúng là người nộp bài không
        if (!submission.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền xem điểm bài này.");
        }

        float score = 0.0f;
        List<Answer> answers = answerRepository.findBySubmission(submission);
        for (Answer answer : answers) {
            Question question = answer.getQuestion();
            int type = question.getQuestionBank().getQuestionType(); // int: 1=MCQ, 2=MSQ, 3=True/False, 4=Short Answer

            switch (type) {
                case 1: // multiple_choice
                case 3: // true_false
                    if (answer.getChosenChoice() != null && answer.getChosenChoice().getIsCorrect()) {
                        score += 1.0f;
                    }
                    break;

                case 2: // multiple_select
                    // Lấy danh sách đáp án đúng cho câu hỏi
                    List<Choice> correctChoices = choiceRepository.findByQuestionBankAndIsCorrectTrue(question.getQuestionBank());
                    // Lấy danh sách đáp án học sinh chọn
                    List<Choice> selectedChoices = answer.getSelectedChoices(); // cần đảm bảo có phương thức này

                    // So sánh xem học sinh chọn đúng toàn bộ và không chọn thừa
                    if (selectedChoices != null &&
                            selectedChoices.containsAll(correctChoices) &&
                            correctChoices.containsAll(selectedChoices)) {
                        score += 1.0f;
                    }
                    break;

                case 4: // short_answer
                    // Bỏ qua, cần chấm tay
                    break;

                default:
                    throw new IllegalStateException("Unknown question type: " + type);
            }
        }


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