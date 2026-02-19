package com.example.flowwow.controller;

import com.example.flowwow.entity.BlogPost;
import com.example.flowwow.entity.TeamMember;
import com.example.flowwow.entity.Testimonial;
import com.example.flowwow.service.ContentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    // Явный конструктор
    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getTestimonials() {
        return ResponseEntity.ok(contentService.getActiveTestimonials());
    }

    @GetMapping("/team")
    public ResponseEntity<List<TeamMember>> getTeamMembers() {
        return ResponseEntity.ok(contentService.getActiveTeamMembers());
    }

    @GetMapping("/blog")
    public ResponseEntity<Page<BlogPost>> getBlogPosts(Pageable pageable) {
        return ResponseEntity.ok(contentService.getActiveBlogPosts(pageable));
    }

    @GetMapping("/blog/{slug}")
    public ResponseEntity<BlogPost> getBlogPost(@PathVariable String slug) {
        return ResponseEntity.ok(contentService.getBlogPostBySlug(slug));
    }

    @GetMapping("/blog/category/{category}")
    public ResponseEntity<Page<BlogPost>> getBlogPostsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        return ResponseEntity.ok(contentService.getBlogPostsByCategory(category, pageable));
    }
}