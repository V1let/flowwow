package com.example.flowwow.dto.content;

public class TestimonialDto {
    private Long id;
    private String authorName;
    private String authorCity;
    private String authorPhoto;
    private String text;
    private Integer rating;

    // Конструкторы
    public TestimonialDto() {
    }

    public TestimonialDto(Long id, String authorName, String authorCity, String authorPhoto,
                          String text, Integer rating) {
        this.id = id;
        this.authorName = authorName;
        this.authorCity = authorCity;
        this.authorPhoto = authorPhoto;
        this.text = text;
        this.rating = rating;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorCity() {
        return authorCity;
    }

    public void setAuthorCity(String authorCity) {
        this.authorCity = authorCity;
    }

    public String getAuthorPhoto() {
        return authorPhoto;
    }

    public void setAuthorPhoto(String authorPhoto) {
        this.authorPhoto = authorPhoto;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}