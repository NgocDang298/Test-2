package com.HTTN.thitn.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChoiceRequest {
    private Integer id;
    private Integer questionBankId;
    private String choiceText;
    private Boolean isCorrect;
}