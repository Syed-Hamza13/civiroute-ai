

USE civiroute;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS ai_predictions;
DROP TABLE IF EXISTS complaint_status_history;
DROP TABLE IF EXISTS complaint_attachments;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS department_types;
DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS super_admins;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE super_admins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE states (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);



CREATE TABLE cities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    state_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,

    INDEX idx_city_state (state_id),

    CONSTRAINT fk_city_state
        FOREIGN KEY (state_id)
        REFERENCES states(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


CREATE TABLE citizens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    address TEXT,
    city_id BIGINT NULL,
    pincode VARCHAR(10),

    is_verified BOOLEAN DEFAULT FALSE,
    status ENUM('active','blocked') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_citizen_email (email),
    INDEX idx_citizen_mobile (mobile),
    INDEX idx_citizen_city (city_id),

    CONSTRAINT fk_citizen_city
        FOREIGN KEY (city_id)
        REFERENCES cities(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE department_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);



CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    department_type_id BIGINT NOT NULL,
    city_id BIGINT NOT NULL,

    office_name VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE,
    mobile VARCHAR(20) UNIQUE,

    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    address TEXT,
    pincode VARCHAR(10),

    status ENUM('active','inactive') DEFAULT 'active',

    created_by BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_department_type (department_type_id),
    INDEX idx_department_city (city_id),
    INDEX idx_department_username (username),

    CONSTRAINT fk_department_type
        FOREIGN KEY (department_type_id)
        REFERENCES department_types(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_department_city
        FOREIGN KEY (city_id)
        REFERENCES cities(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_department_admin
        FOREIGN KEY (created_by)
        REFERENCES super_admins(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);



CREATE TABLE complaints (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    citizen_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    language VARCHAR(50),

    predicted_department_type_id BIGINT NULL,
    final_department_id BIGINT NULL,

    priority ENUM(
        'low',
        'medium',
        'high',
        'critical'
    ) DEFAULT 'medium',

    status ENUM(
        'submitted',
        'assigned',
        'in_progress',
        'resolved',
        'closed',
        'rejected'
    ) DEFAULT 'submitted',

    confidence_score DECIMAL(5,2),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address_text TEXT,

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,

    INDEX idx_complaint_citizen (citizen_id),
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_priority (priority),

    CONSTRAINT fk_complaint_citizen
        FOREIGN KEY (citizen_id)
        REFERENCES citizens(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_complaint_predicted_type
        FOREIGN KEY (predicted_department_type_id)
        REFERENCES department_types(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_complaint_department
        FOREIGN KEY (final_department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);



CREATE TABLE complaint_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_id BIGINT NOT NULL,

    file_url VARCHAR(500) NOT NULL,
    file_type ENUM('image','video','document') NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attachment_complaint (complaint_id),

    CONSTRAINT fk_attachment_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



CREATE TABLE complaint_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    complaint_id BIGINT NOT NULL,

    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,

    remarks TEXT,

    updated_by_role ENUM(
        'admin',
        'department',
        'system'
    ),

    updated_by_id BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_status_history_complaint (complaint_id),

    CONSTRAINT fk_status_history_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



CREATE TABLE ai_predictions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    complaint_id BIGINT NOT NULL,

    detected_language VARCHAR(50),
    translated_text TEXT,

    predicted_category VARCHAR(100),
    confidence_score DECIMAL(5,2),

    model_name VARCHAR(100),
    model_version VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_ai_prediction_complaint (complaint_id),

    CONSTRAINT fk_ai_prediction_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_type ENUM(
        'citizen',
        'department',
        'admin'
    ) NOT NULL,

    user_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notification_user (user_type, user_id)
);

