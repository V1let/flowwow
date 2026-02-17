package com.example.flowwow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "team_members")
public class TeamMember extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String position;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Конструкторы
    public TeamMember() {
    }

    public TeamMember(String name, String position, String photoPath,
                      String description, Integer sortOrder, Boolean isActive) {
        this.name = name;
        this.position = position;
        this.photoPath = photoPath;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
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

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}