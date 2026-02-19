package com.example.flowwow.service;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    public void sendPasswordResetEmail(String to, String resetLink) {
        // В реальном проекте здесь будет отправка email через JavaMailSender
        // Для разработки просто логируем
        logger.info("=================================");
        logger.info("Отправка email на: " + to);
        logger.info("Ссылка для сброса пароля: " + resetLink);
        logger.info("=================================");
    }
}