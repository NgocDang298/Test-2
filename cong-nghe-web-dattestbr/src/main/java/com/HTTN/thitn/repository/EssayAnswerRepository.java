package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.EssayAnswer;
import com.HTTN.thitn.entity.Question;
import com.HTTN.thitn.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EssayAnswerRepository extends JpaRepository<EssayAnswer, Integer> {
    List<EssayAnswer> findBySubmission(Submission submission);
    List<EssayAnswer> findByQuestion(Question question);
}