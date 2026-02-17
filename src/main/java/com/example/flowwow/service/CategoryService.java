package com.example.flowwow.service;

import com.example.flowwow.entity.Category;
import com.example.flowwow.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Явный конструктор
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));
    }

    public Category createCategory(Category category) {
        category.setSlug(generateSlug(category.getName()));
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImagePath(categoryDetails.getImagePath());
        category.setSortOrder(categoryDetails.getSortOrder());
        category.setIsActive(categoryDetails.getIsActive());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^а-яa-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }
}