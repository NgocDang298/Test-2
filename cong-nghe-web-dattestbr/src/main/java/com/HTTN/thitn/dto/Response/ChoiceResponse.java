package com.HTTN.thitn.dto.Response;

import com.HTTN.thitn.entity.Choice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChoiceResponse {
    private Integer id;
    private String choiceText;
    private Boolean isCorrect;

    public ChoiceResponse(Choice choice) {
        this.id = choice.getId();
        this.choiceText = choice.getChoiceText();
        this.isCorrect = choice.getIsCorrect();
    }
}

