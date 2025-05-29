package com.HTTN.thitn.service;

import com.HTTN.thitn.entity.*;
import com.HTTN.thitn.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SubjectStudentRepository subjectStudentRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionBankRepository questionBankRepository;
    @Autowired
    private SubjectTeacherRepository subjectTeacherRepository;

    public Question addQuestionToExam(Integer examId, Integer questionBankId, User user) {
        Exam exam = examRepository.findById(examId).orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        QuestionBank questionBank = questionBankRepository.findById(questionBankId).orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionBankId));
        boolean isAssigned = subjectTeacherRepository.findBySubjectIdAndTeacherId(questionBank.getSubject().getId(), user.getId()).isPresent();
        if (!isAssigned) {
            throw new SecurityException("Bạn không có quyền thêm câu hỏi cho môn học này.");
        }
        if (!questionBank.getSubject().getId().equals(exam.getSubject().getId())) {
            throw new IllegalArgumentException("Câu hỏi không thuộc cùng môn học với đề thi.");
        }
        Question question = new Question();
        question.setExam(exam);
        question.setQuestionBank(questionBank);
        return questionRepository.save(question);
    }

    public void removeQuestionFromExam(Long examId, Long questionId, User user) {

        Question question = questionRepository.findByExamIdAndQuestionBankId(examId,questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
        if (!question.getExam().getId().equals(examId)) {
            throw new IllegalArgumentException("Câu hỏi không thuộc đề thi có id: " + examId);
        }
        boolean isAssigned = subjectTeacherRepository
                    .findBySubjectIdAndTeacherId(question.getQuestionBank().getSubject().getId(), user.getId())
                    .isPresent();
        if (!isAssigned) {
                throw new SecurityException("Bạn không có quyền xóa câu hỏi cho môn học này.");
            }
        if (!question.getExam().getCreatedBy().getId().equals(user.getId())) {
            throw new SecurityException("Chỉ người tạo đề mới có quyền xóa câu hỏi.");
        }
        questionRepository.delete(question);
    }

    public List<Question> getQuestionsByExam(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));
        return questionRepository.findByExam(exam);
    }
    public List<Question> getQuestionsByExamForStudent(Integer examId, User user) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));

        Subject subject = exam.getSubject();

        boolean isStudentEnrolled = subjectStudentRepository
                .findBySubjectIdAndStudentId(subject.getId(), user.getId())
                .isPresent();

        if (!isStudentEnrolled) {
            throw new SecurityException("Bạn không có quyền xem đề thi của môn học này.");
        }

        return questionRepository.findByExam(exam);
    }

    // pthuc tạo đề bằng random câu hỏi
    @Transactional
    public void autoGenerateExam(Integer examId, int numberOfQuestions, User user) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));

        // Lấy subject từ exam hoặc từ nơi khác nếu bạn có mapping
        Subject subject = exam.getSubject();

        // Kiểm tra giáo viên có quyền tạo đề cho môn này không
        boolean isAssigned = subjectTeacherRepository
                .findBySubjectIdAndTeacherId(subject.getId(), user.getId())
                .isPresent();
        if (!isAssigned) {
            throw new SecurityException("Bạn không có quyền tạo đề cho môn học này.");
        }

        // Lấy các câu hỏi từ ngân hàng thuộc môn học này
        List<QuestionBank> allQuestions = questionBankRepository.findBySubjectId(subject.getId());
        if (allQuestions.size() < numberOfQuestions) {
            throw new IllegalArgumentException("Không đủ câu hỏi để tạo đề");
        }

        // Random các câu hỏi
        Collections.shuffle(allQuestions);
        List<QuestionBank> selectedQuestions = allQuestions.subList(0, numberOfQuestions);

        // Lưu vào bảng questions
        for (QuestionBank qb : selectedQuestions) {
            Question question = new Question();
            question.setExam(exam);
            question.setQuestionBank(qb);
            questionRepository.save(question);
        }
    }
    @Transactional
    public void autoGenerateExamWithDifficulty(Integer examId, Map<Integer, Integer> difficultyMap, User user) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + examId));

        Subject subject = exam.getSubject();
        boolean isAssigned = subjectTeacherRepository
                .findBySubjectIdAndTeacherId(subject.getId(), user.getId())
                .isPresent();
        if (!isAssigned) {
            throw new SecurityException("Bạn không có quyền tạo đề cho môn học này.");
        }

        for (Map.Entry<Integer, Integer> entry : difficultyMap.entrySet()) {
            Integer difficulty = entry.getKey();
            Integer count = entry.getValue();

            List<QuestionBank> questionsByDifficulty = questionBankRepository
                    .findBySubjectIdAndDifficulty(subject.getId(), difficulty);

            if (questionsByDifficulty.size() < count) {
                throw new IllegalArgumentException("Không đủ câu hỏi độ khó " + difficulty);
            }

            Collections.shuffle(questionsByDifficulty);
            List<QuestionBank> selected = questionsByDifficulty.subList(0, count);

            for (QuestionBank qb : selected) {
                Question q = new Question();
                q.setExam(exam);
                q.setQuestionBank(qb);
                questionRepository.save(q);
            }
        }
    }


}