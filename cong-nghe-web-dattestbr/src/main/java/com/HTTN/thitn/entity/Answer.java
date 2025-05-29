package com.HTTN.thitn.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "answers")
@Data
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "chosen_choice_id")
    private Choice chosenChoice;
    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerChoice> selectedAnswerChoices = new ArrayList<>();

    // Lấy danh sách các Choice được chọn (cho đa lựa chọn)
    public List<Choice> getSelectedChoices() {
        return selectedAnswerChoices.stream()
                .map(AnswerChoice::getChoice)
                .collect(Collectors.toList());
    }

}
