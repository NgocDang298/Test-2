package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.QuestionBank;
import com.HTTN.thitn.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionBankRepository extends JpaRepository<QuestionBank, Integer> {
    List<QuestionBank> findBySubject(Subject subject);
    List<QuestionBank> findBySubjectId(Long subjectId);
    List<QuestionBank> findByQuestionTypeAndDifficulty(Integer questionType, Integer difficulty);
    List<QuestionBank> findBySubjectIdAndDifficulty(Long subjectId, Integer difficulty);

}