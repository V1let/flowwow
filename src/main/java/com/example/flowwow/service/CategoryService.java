package com.example.flowwow.service;

import com.example.flowwow.entity.Category;
import com.example.flowwow.repository.CategoryRepository;
import com.example.flowwow.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private static final String ARCHIVED_SLUG_PREFIX = "deleted-";

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
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

    @Transactional
    public void deleteCategory(Long id) {
        var products = productRepository.findByCategoryId(id);
        if (products != null && !products.isEmpty()) {
            var hasActive = products.stream()
                    .anyMatch(p -> p.getSlug() == null || !p.getSlug().startsWith(ARCHIVED_SLUG_PREFIX));
            if (hasActive) {
                throw new IllegalStateException("Нельзя удалить категорию с активными товарами. Сначала удалите или перенесите товары.");
            }

            // только архивные товары — отвязываем категорию
            products.forEach(p -> p.setCategory(null));
            productRepository.saveAll(products);
        }

        categoryRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^а-яa-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }
}
