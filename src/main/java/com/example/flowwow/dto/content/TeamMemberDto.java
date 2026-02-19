package com.example.flowwow.dto.content;

public class TeamMemberDto {
    private Long id;
    private String name;
    private String position;
    private String photoPath;
    private String description;

    // Конструкторы
    public TeamMemberDto() {
    }

    public TeamMemberDto(Long id, String name, String position, String photoPath, String description) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.photoPath = photoPath;
        this.description = description;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}