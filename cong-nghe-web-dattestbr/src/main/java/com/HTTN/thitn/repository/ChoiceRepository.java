package com.HTTN.thitn.repository;

import com.HTTN.thitn.entity.Choice;
import com.HTTN.thitn.entity.Question;
import com.HTTN.thitn.entity.QuestionBank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChoiceRepository extends JpaRepository<Choice, Integer> {
    List<Choice> findByQuestionBank(QuestionBank questionBank);

    List<Choice> findByQuestionBankAndIsCorrectTrue(QuestionBank questionBank);
    long countByQuestionBankAndIsCorrectTrue(QuestionBank questionBank);

}