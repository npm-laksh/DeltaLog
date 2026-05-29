package com.laksh.app.deltalog.config;

import jakarta.annotation.PostConstruct;
import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    private final DataSource dataSource;

    public FlywayConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void migrateFlyway() {
        System.out.println("🚀 [DeltaLog Lifecycle] Manual Flyway Trigger Waking Up...");

        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .baselineOnMigrate(true)
                .locations("classpath:db/migration")
                .load();

        flyway.migrate();

        System.out.println("[DeltaLog Lifecycle] Manual Flyway Trigger complete...");
    }
}
