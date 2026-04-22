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
import org.thymeleaf.context.Context;
import java.time.LocalDateTime;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

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

    @Async
    public void sendWelcomeEmail(User user) {
        System.out.println("=== sendWelcomeEmail ENTERED for " + user.getEmail() + " ===");
        if (!Boolean.TRUE.equals(user.getEmailNotifications())) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🌱 Welcome to SGEMS – Smart Green Energy");

            Context context = new Context();
            context.setVariable("user", user);
            String html = templateEngine.process("welcome-email", context);
            helper.setText(html, true);

            mailSender.send(message);
            logger.info("Welcome email sent to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendLoginAlertEmail(User user, String ipAddress, String userAgent) {
        if (!Boolean.TRUE.equals(user.getEmailNotifications())) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🔐 New login to your SGEMS account");

            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("ipAddress", ipAddress != null ? ipAddress : "unknown");
            context.setVariable("userAgent", userAgent != null ? userAgent : "unknown");
            context.setVariable("loginTime", java.time.LocalDateTime.now());

            String html = templateEngine.process("login-alert-email", context);
            helper.setText(html, true);

            mailSender.send(message);
            logger.info("Login alert email sent to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send login alert to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}