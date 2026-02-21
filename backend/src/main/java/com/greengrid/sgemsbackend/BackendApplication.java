package com.greengrid.sgemsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;  // ✅ ADD THIS LINE

@SpringBootApplication
@EnableCaching  // ✅ ADD THIS LINE
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}