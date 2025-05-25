package com.HTTN.thitn.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResponse {
    private Integer id;
    private Integer submissionId;
    private Integer questionId;
    private Integer chosenChoiceId;
}
