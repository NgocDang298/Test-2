package com.HTTN.thitn.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamRequest {
    private Integer id;
    private String title;
    private String description;
    private Integer subjectId;
    private Integer duration;
    private Integer createdById;
}