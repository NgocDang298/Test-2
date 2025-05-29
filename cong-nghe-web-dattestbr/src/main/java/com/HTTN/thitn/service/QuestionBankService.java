package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.entity.Subject;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.repository.QuestionBankRepository;
import com.HTTN.thitn.repository.SubjectRepository;
import com.HTTN.thitn.repository.SubjectTeacherRepository;
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
    @Autowired
    private SubjectTeacherRepository subjectTeacherRepository;

    public QuestionBank createQuestion(QuestionBank question, User createdBy) {
        validateQuestion(question);

        Subject subject = subjectRepository.findById(question.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + question.getSubject().getId()));

        //  Kiểm tra quyền dạy môn học
        boolean isAssigned = subjectTeacherRepository
                .findBySubjectIdAndTeacherId(subject.getId(), createdBy.getId())
                .isPresent();

        if (!isAssigned) {
            throw new SecurityException("Bạn không có quyền tạo câu hỏi cho môn học này.");
        }

        question.setSubject(subject);
        question.setCreatedBy(createdBy);

        return questionBankRepository.save(question);
    }


    public QuestionBank updateQuestion(Integer id, QuestionBank question, User currentUser) {
        validateQuestion(question);

        QuestionBank existingQuestion = questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

        // ✅ Kiểm tra người tạo
        if (!existingQuestion.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new SecurityException("Bạn không có quyền cập nhật câu hỏi này.");
        }

        Subject subject = subjectRepository.findById(question.getSubject().getId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + question.getSubject().getId()));

        existingQuestion.setSubject(subject);
        existingQuestion.setQuestionText(question.getQuestionText());
        existingQuestion.setQuestionType(question.getQuestionType());
        existingQuestion.setDifficulty(question.getDifficulty());

        return questionBankRepository.save(existingQuestion);
    }


    public void deleteQuestion(Integer id, User currentUser) {
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

        // ✅ Kiểm tra người tạo
        if (!question.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new SecurityException("Bạn không có quyền xóa câu hỏi này.");
        }

        questionBankRepository.delete(question);
    }


    public QuestionBank getQuestionById(Integer id) {
        return questionBankRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
    }

    public List<QuestionBank> getQuestionsBySubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + subjectId));
        return questionBankRepository.findBySubject(subject);
    }
    // kiểm tra độ khó
    private void validateQuestion(QuestionBank question) {
        if (!List.of(1, 2, 3, 4).contains(question.getQuestionType())) {
            throw new IllegalArgumentException("Invalid question type");
        }
        if (question.getDifficulty() < 1 || question.getDifficulty() > 3) {
            throw new IllegalArgumentException("Difficulty must be between 1 and 3");
        }
    }
}
