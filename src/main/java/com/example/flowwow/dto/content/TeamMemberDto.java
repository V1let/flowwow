package com.example.flowwow.dto.content;

import lombok.Data;

@Data
public class TeamMemberDto {
    private Long id;
    private String name;
    private String position;
    private String photoPath;
    private String description;
}