package com.greengrid.sgemsbackend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "solarmanToken",    // Cache for API token
                "stationId",        // Cache for station ID
                "energyData"        // Cache for energy readings
        );

        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(15, TimeUnit.MINUTES)  // Cache expires after 15 minutes
                .maximumSize(100)                         // Max 100 entries per cache
                .recordStats());                          // Enable statistics

        return cacheManager;
    }
}