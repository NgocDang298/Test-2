package com.HTTN.thitn.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionBankRequest {
    private Integer id;
    private Integer subjectId;
    private String questionText;
    private String questionType;
    private Integer difficulty;
    private Integer createdById;
}
