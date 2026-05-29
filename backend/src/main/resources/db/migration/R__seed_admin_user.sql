-- Seed a default admin user safely without requiring an email unique index.
INSERT INTO users (email, password, role, username)
SELECT 'admin@deltalog.com', '$2a$10$JAPMHIeiKd/x2MYaw2rkjeIojsDdOwxU1q17LR8k3F6xalxP0WoE2', 'ADMIN', 'DeltaLog Admin'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@deltalog.com'
);