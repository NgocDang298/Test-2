package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.Submission;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.ExamRepository;
import com.HTTN.thitn.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ExamRepository examRepository;

    public Submission createSubmission(Integer examId, User user, String userRole) {
        if (!userRole.equals("student")) {
            throw new SecurityException("Only students can submit exams");
        }
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        Submission submission = new Submission();
        submission.setExam(exam);
        submission.setUser(user);
        return submissionRepository.save(submission);
    }

    public Submission getSubmissionById(Integer submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with id: " + submissionId));
    }

    public List<Submission> getSubmissionsByExam(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        return submissionRepository.findByExam(exam);
    }

    public List<Submission> getSubmissionsByUser(User user) {
        return submissionRepository.findByUser(user);
    }
}
