package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.Exam;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.ExamRepository;
import com.HTTN.thitn.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public Exam createExam(Exam exam, User createdBy, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can create exams");
        }
        if (exam.getDuration() <= 0) {
            throw new IllegalArgumentException("Duration must be positive");
        }
        Subject subject = subjectRepository.findById(exam.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + exam.getSubject().getId()));
        exam.setSubject(subject);
        exam.setCreatedBy(createdBy);
        return examRepository.save(exam);
    }

    public Exam updateExam(Integer id, Exam exam, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException("Only teachers or admins can update exams");
        }
        Exam existingExam = examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + id));
        Subject subject = subjectRepository.findById(exam.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + exam.getSubject().getId()));
        existingExam.setTitle(exam.getTitle());
        existingExam.setDescription(exam.getDescription());
        existingExam.setSubject(subject);
        existingExam.setDuration(exam.getDuration());
        return examRepository.save(existingExam);
    }

    public void deleteExam(Integer id, String userRole) {
        if (!userRole.equals("teacher") && !userRole.equals("admin")) {
            throw new SecurityException(" Only teachers or admins can delete exams");
        }
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + id));
        examRepository.delete(exam);
    }

    public Exam getExamById(Integer id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + id));
    }

    public List<Exam> getExamsBySubject(Integer subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + subjectId));
        return examRepository.findBySubject(subject);
    }
}