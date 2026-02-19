package com.example.flowwow.config;

import com.example.flowwow.entity.Category;
import com.example.flowwow.repository.CategoryRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@ConditionalOnProperty(prefix = "app.seed.categories", name = "enabled", havingValue = "true")
public class CategorySeedRunner implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public CategorySeedRunner(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<CategorySeed> defaults = List.of(
                new CategorySeed("Романтические", "romantic", 10),
                new CategorySeed("Свадебные", "wedding", 20),
                new CategorySeed("Весенние", "spring", 30),
                new CategorySeed("День рождения", "birthday", 40)
        );

        for (CategorySeed seed : defaults) {
            if (categoryRepository.existsBySlug(seed.slug())) {
                continue;
            }

            Category category = new Category();
            category.setName(seed.name());
            category.setSlug(seed.slug());
            category.setDescription("");
            category.setImagePath(null);
            category.setSortOrder(seed.sortOrder());
            category.setIsActive(true);
            categoryRepository.save(category);
        }
    }

    private record CategorySeed(String name, String slug, Integer sortOrder) {
    }
}
