package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.entity.Alert;
import com.greengrid.sgemsbackend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendAlertEmail(Alert alert, User user) {
        if (!Boolean.TRUE.equals(user.getEmailNotifications())) {
            logger.info("Email notifications disabled for user: {}", user.getEmail());
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("⚠️ Solar Alert: " + alert.getIssue());

            Context context = new Context();
            context.setVariable("alert", alert);
            context.setVariable("user", user);
            String html = templateEngine.process("alert-email.html", context);

            helper.setText(html, true);

            mailSender.send(message);
            logger.info("Alert email sent to {} for alert ID {}", user.getEmail(), alert.getId());
        } catch (MessagingException e) {
            logger.error("Failed to send email for alert {}: {}", alert.getId(), e.getMessage());
        }
    }
}