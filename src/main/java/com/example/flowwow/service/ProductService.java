package com.example.flowwow.service;

import com.example.flowwow.dto.product.ProductCreateRequest;
import com.example.flowwow.entity.Category;
import com.example.flowwow.entity.Product;
import com.example.flowwow.entity.ProductImage;
import com.example.flowwow.repository.CategoryRepository;
import com.example.flowwow.repository.ProductImageRepository;
import com.example.flowwow.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    // Явный конструктор
    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));
    }

    public List<Product> getHits() {
        return productRepository.findByIsHitTrue();
    }

    public List<Product> getNewProducts() {
        return productRepository.findByIsNewTrue();
    }

    public Page<Product> filterProducts(Long categoryId,
                                        BigDecimal minPrice,
                                        BigDecimal maxPrice,
                                        String search,  // ← НОВЫЙ ПАРАМЕТР
                                        Pageable pageable) {
        return productRepository.searchProducts(categoryId, minPrice, maxPrice, search, pageable);
    }

    @Transactional
    public Product createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(generateSlug(request.getName()));
        product.setCategory(category);
        product.setComposition(request.getComposition());
        product.setPrice(request.getPrice());
        product.setOldPrice(request.getOldPrice());
        product.setDescription(request.getDescription());
        product.setIsHit(request.getIsHit());
        product.setIsNew(request.getIsNew());
        product.setQuantityInStock(0);

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductCreateRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена"));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setComposition(request.getComposition());
        product.setPrice(request.getPrice());
        product.setOldPrice(request.getOldPrice());
        product.setDescription(request.getDescription());
        product.setIsHit(request.getIsHit());
        product.setIsNew(request.getIsNew());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public void addImageToProduct(Long productId, String imagePath, Boolean isMain) {
        Product product = getProductById(productId);

        if (isMain) {
            productImageRepository.findByProductIdOrderBySortOrderAsc(productId).stream()
                    .filter(img -> img.getIsMain())
                    .forEach(img -> img.setIsMain(false));
        }

        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImagePath(imagePath);
        image.setIsMain(isMain);

        productImageRepository.save(image);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^а-яa-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }
}