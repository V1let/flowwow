package com.example.flowwow.repository;

import com.example.flowwow.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlugAndIsActiveTrue(String slug);
    Page<BlogPost> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<BlogPost> findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(String category, Pageable pageable);
}