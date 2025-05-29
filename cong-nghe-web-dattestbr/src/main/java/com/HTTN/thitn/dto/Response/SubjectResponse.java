package com.HTTN.thitn.dto.Response;

import com.HTTN.thitn.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {
    private Long id;
    private String name;
    private String description;

    public SubjectResponse(Subject subject) {
        this.id = subject.getId();
        this.name = subject.getName();
        this.description = subject.getDescription();
    }
}
