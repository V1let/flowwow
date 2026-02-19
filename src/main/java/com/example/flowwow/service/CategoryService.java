package com.example.flowwow.service;

import com.example.flowwow.entity.Category;
import com.example.flowwow.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrIsActiveIsNullOrderBySortOrderAsc();
    }

    public List<Category> getAllCategoriesForAdmin() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
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
        // Устанавливаем значения по умолчанию
        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }
        if (category.getSortOrder() == null) {
            category.setSortOrder(0);
        }
        category.setSlug(generateSlug(category.getName()));
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImagePath(categoryDetails.getImagePath());
        category.setSortOrder(categoryDetails.getSortOrder() != null ? categoryDetails.getSortOrder() : 0);
        category.setIsActive(categoryDetails.getIsActive() != null ? categoryDetails.getIsActive() : true);
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
