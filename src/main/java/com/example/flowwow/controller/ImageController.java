package com.example.flowwow.controller;

import com.example.flowwow.entity.ProductImage;
import com.example.flowwow.repository.ProductImageRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ProductImageRepository productImageRepository;

    public ImageController(ProductImageRepository productImageRepository) {
        this.productImageRepository = productImageRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        ProductImage image = productImageRepository.findById(id)
                .orElse(null);

        if (image == null || image.getImageData() == null || image.getImageData().length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String contentType = image.getContentType();
        MediaType mediaType = (contentType != null && !contentType.isBlank())
                ? MediaType.parseMediaType(contentType)
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, mediaType.toString())
                .body(image.getImageData());
    }
}
