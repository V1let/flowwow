package com.example.flowwow.service;

import com.example.flowwow.entity.BlogPost;
import com.example.flowwow.entity.TeamMember;
import com.example.flowwow.entity.Testimonial;
import com.example.flowwow.repository.BlogPostRepository;
import com.example.flowwow.repository.TeamMemberRepository;
import com.example.flowwow.repository.TestimonialRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    private final TestimonialRepository testimonialRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final BlogPostRepository blogPostRepository;

    // Явный конструктор
    public ContentService(TestimonialRepository testimonialRepository,
                          TeamMemberRepository teamMemberRepository,
                          BlogPostRepository blogPostRepository) {
        this.testimonialRepository = testimonialRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.blogPostRepository = blogPostRepository;
    }

    public List<Testimonial> getActiveTestimonials() {
        return testimonialRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<TeamMember> getActiveTeamMembers() {
        return teamMemberRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    public Page<BlogPost> getActiveBlogPosts(Pageable pageable) {
        return blogPostRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    public BlogPost getBlogPostBySlug(String slug) {
        return blogPostRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));
    }

    public Page<BlogPost> getBlogPostsByCategory(String category, Pageable pageable) {
        return blogPostRepository.findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(category, pageable);
    }
}