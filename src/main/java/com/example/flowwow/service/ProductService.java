package com.example.flowwow.service;

import com.example.flowwow.dto.product.ProductCreateRequest;
import com.example.flowwow.dto.product.ProductUpdateRequest;
import com.example.flowwow.dto.product.ProductImageRequest;
import com.example.flowwow.entity.Category;
import com.example.flowwow.entity.Product;
import com.example.flowwow.entity.ProductImage;
import com.example.flowwow.repository.CategoryRepository;
import com.example.flowwow.repository.CartItemRepository;
import com.example.flowwow.repository.FavoriteRepository;
import com.example.flowwow.repository.OrderItemRepository;
import com.example.flowwow.repository.ProductImageRepository;
import com.example.flowwow.repository.ProductRepository;
import com.example.flowwow.repository.ReviewRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProductService {
    private static final String ARCHIVED_SLUG_PREFIX = "deleted-";
    private static final Set<String> FINAL_ORDER_STATUSES = Set.of("DELIVERED", "COMPLETED", "CANCELLED");
    private static final Pattern IMAGE_ID_PATTERN = Pattern.compile(".*/api/images/(\\d+)$");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final CartItemRepository cartItemRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;

    // Явный конструктор
    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductImageRepository productImageRepository,
                          CartItemRepository cartItemRepository,
                          FavoriteRepository favoriteRepository,
                          ReviewRepository reviewRepository,
                          OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.cartItemRepository = cartItemRepository;
        this.favoriteRepository = favoriteRepository;
        this.reviewRepository = reviewRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findNotArchived();
    }

    public List<Product> getArchivedProductsForAdmin() {
        return productRepository.findBySlugStartingWith(ARCHIVED_SLUG_PREFIX);
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
        return productRepository.findActiveHits();
    }

    public List<Product> getNewProducts() {
        return productRepository.findActiveNew();
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
        product.setSlug(generateSlug(request.getName()));
        product.setCategory(category);
        product.setComposition(request.getComposition());
        product.setPrice(request.getPrice());
        product.setOldPrice(request.getOldPrice());
        product.setDescription(request.getDescription());
        product.setIsHit(request.getIsHit());
        product.setIsNew(request.getIsNew());
        product.setQuantityInStock(0);

        Product saved = productRepository.save(product);
        applyImages(saved, request.getImages());
        return productRepository.save(saved);
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

        Product saved = productRepository.save(product);
        applyImages(saved, request.getImages());
        return productRepository.save(saved);
    }

    @Transactional
    public Product updateProductPartial(Long id, ProductUpdateRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена"));
            product.setCategory(category);
        }

        if (request.getName() != null) {
            product.setName(request.getName());
            product.setSlug(generateSlug(request.getName()));
        }
        if (request.getComposition() != null) {
            product.setComposition(request.getComposition());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getOldPrice() != null) {
            product.setOldPrice(request.getOldPrice());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getIsHit() != null) {
            product.setIsHit(request.getIsHit());
        }
        if (request.getIsNew() != null) {
            product.setIsNew(request.getIsNew());
        }

        Product saved = productRepository.save(product);
        if (request.getImages() != null) {
            applyImages(saved, request.getImages());
            return productRepository.save(saved);
        }
        return saved;
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (orderItemRepository.existsByProductId(id)) {
            List<String> statuses = orderItemRepository.findDistinctOrderStatusesByProductId(id);
            boolean hasActiveOrders = statuses.stream()
                    .filter(status -> status != null)
                    .map(String::toUpperCase)
                    .anyMatch(status -> !FINAL_ORDER_STATUSES.contains(status));

            if (hasActiveOrders) {
                throw new IllegalStateException("Нельзя удалить товар: есть активные заказы с этим товаром.");
            }

            archiveProduct(id);
            return;
        }

        cartItemRepository.deleteByProductId(id);
        favoriteRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }

    @Transactional
    public Product restoreProduct(Long id) {
        Product product = getProductById(id);
        if (!isArchived(product)) {
            throw new IllegalStateException("Товар не находится в архиве.");
        }

        String originalSlug = extractOriginalSlug(product.getSlug());
        if (originalSlug == null || originalSlug.isBlank()) {
            originalSlug = generateSlug(product.getName());
        }

        String restoredSlug = originalSlug;
        if (productRepository.existsBySlug(restoredSlug)) {
            restoredSlug = originalSlug + "-restored-" + product.getId();
        }

        product.setSlug(restoredSlug);
        return productRepository.save(product);
    }

    @Transactional
    private void archiveProduct(Long id) {
        Product product = getProductById(id);

        cartItemRepository.deleteByProductId(id);
        favoriteRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);

        product.setIsHit(false);
        product.setIsNew(false);
        product.setQuantityInStock(0);
        product.setSlug(buildArchivedSlug(product));
        productRepository.save(product);
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

    @Transactional
    public ProductImage addImageToProductUpload(Long productId, MultipartFile file, Boolean isMain, Integer sortOrder) {
        Product product = getProductById(productId);

        if (Boolean.TRUE.equals(isMain)) {
            productImageRepository.findByProductIdOrderBySortOrderAsc(productId).stream()
                    .filter(img -> img.getIsMain())
                    .forEach(img -> img.setIsMain(false));
        }

        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImagePath("");
        image.setIsMain(Boolean.TRUE.equals(isMain));
        image.setSortOrder(sortOrder != null ? sortOrder : 0);

        try {
            image.setImageData(file.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Не удалось прочитать файл");
        }
        image.setContentType(file.getContentType());

        ProductImage saved = productImageRepository.save(image);
        saved.setImagePath("/api/images/" + saved.getId());
        return productImageRepository.save(saved);
    }

    private void applyImages(Product product, List<ProductImageRequest> images) {
        if (images == null) return;

        List<ProductImage> newImages = new java.util.ArrayList<>();

        boolean hasMain = images.stream().anyMatch(i -> Boolean.TRUE.equals(i.getIsMain()));
        for (int i = 0; i < images.size(); i++) {
            ProductImageRequest req = images.get(i);
            if (req == null || req.getImagePath() == null || req.getImagePath().isBlank()) {
                continue;
            }

            String path = req.getImagePath().trim();
            ProductImage img = resolveExistingImage(path);
            if (img == null) {
                img = new ProductImage();
                img.setImagePath(path);
            }
            img.setProduct(product);
            img.setIsMain(hasMain ? Boolean.TRUE.equals(req.getIsMain()) : i == 0);
            img.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : i);
            newImages.add(img);
        }
        product.getImages().clear();
        product.getImages().addAll(newImages);
    }

    private ProductImage resolveExistingImage(String imagePath) {
        if (imagePath == null) return null;
        Matcher matcher = IMAGE_ID_PATTERN.matcher(imagePath);
        if (!matcher.matches()) return null;
        try {
            Long id = Long.valueOf(matcher.group(1));
            return productImageRepository.findById(id).orElse(null);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^а-яa-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }

    private boolean isArchived(Product product) {
        return product.getSlug() != null && product.getSlug().startsWith(ARCHIVED_SLUG_PREFIX);
    }

    private String buildArchivedSlug(Product product) {
        return ARCHIVED_SLUG_PREFIX + product.getId() + "-" + product.getSlug();
    }

    private String extractOriginalSlug(String archivedSlug) {
        if (archivedSlug == null || !archivedSlug.startsWith(ARCHIVED_SLUG_PREFIX)) {
            return archivedSlug;
        }

        int secondDashIndex = archivedSlug.indexOf('-', ARCHIVED_SLUG_PREFIX.length());
        if (secondDashIndex == -1 || secondDashIndex + 1 >= archivedSlug.length()) {
            return "";
        }
        return archivedSlug.substring(secondDashIndex + 1);
    }
}
