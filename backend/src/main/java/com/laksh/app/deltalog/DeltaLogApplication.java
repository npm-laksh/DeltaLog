package com.laksh.app.deltalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

@SpringBootApplication
public class DeltaLogApplication {

    public static void main(String[] args) {

        // env & application properties

        String userDir = System.getProperty("user.dir");
        Path envPath = Paths.get(userDir).getParent().resolve("infra").resolve(".env");

        if (!Files.exists(envPath)) {
            envPath = Paths.get(userDir).resolve("infra").resolve(".env");
        }

        Properties envProps = new Properties();

        if (Files.exists(envPath)) {
            try (FileInputStream fileInputStream = new FileInputStream(envPath.toFile())) {
                envProps.load(fileInputStream);
            } catch (IOException e) {
                System.err.println("Failed to read infrastructure configuration properties: " + e.getMessage());
            }
        }

        SpringApplication app = new SpringApplication(DeltaLogApplication.class);

        if (!envProps.isEmpty()) {
            app.setDefaultProperties(envProps);
        }

        app.run(args);
    }
}