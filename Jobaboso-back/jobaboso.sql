
CREATE TABLE `companies` (
    id INT NOT NULL AUTO_INCREMENT,
    company_type VARCHAR(30) NULL,
    registration_name VARCHAR(100) NULL,
    company_name VARCHAR(30) NULL,
    company_address VARCHAR(200) NULL,
    business_license_no VARCHAR(50) NULL,
    is_partner BOOLEAN NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `users` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL UNIQUE, 
    password VARCHAR(255) NULL,
    user_type ENUM('personal','company','university_staff') NULL,
    name VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    points INT NOT NULL DEFAULT 100
);

CREATE TABLE `personalusers` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    birth_date DATE,
    gender CHAR(1),
    profile_addr VARCHAR(300),
    privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `company_contents` (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    file_addr VARCHAR(255) NULL,
    youtube_url VARCHAR(255) NULL,
    hashtags VARCHAR(255) NULL,
    content_type VARCHAR(30) NULL,
    created_at DATETIME NULL,
    PRIMARY KEY (id),
    INDEX (company_id)
);

CREATE TABLE `company_likes_personal` (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    contact_email VARCHAR(100) NULL,
    contact_phone VARCHAR(30) NULL,
    suggested_position VARCHAR(50) NULL,
    company_name VARCHAR(30) NULL,
    hr_manager_name VARCHAR(50) NULL,
    created_at DATETIME NULL,
    PRIMARY KEY (id),
    INDEX (company_id),
    INDEX (user_id)
);

CREATE TABLE `application_files` (
    id INT NOT NULL AUTO_INCREMENT,
    file_type VARCHAR(20) NULL,
    file_path VARCHAR(255) NULL,
    application_id INT NULL,
    PRIMARY KEY (id),
    INDEX (application_id)
);


CREATE TABLE skills (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    skill_name VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `university_staff` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL,
    univ_name VARCHAR(20) NULL,
    Field VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id)
);


CREATE TABLE projects (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    project_name VARCHAR(20),
    description VARCHAR(300),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `company_users` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL, 
    company_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE `application_events` (
    id INT NOT NULL AUTO_INCREMENT,
    event_type VARCHAR(20) NULL,
    event_date DATE NULL,
    memo VARCHAR(255) NULL,
    application_id INT NULL,
    PRIMARY KEY (id),
    INDEX (application_id)
);


CREATE TABLE activities (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    type ENUM('contest','club','intern'),
    title VARCHAR(30),
    detail VARCHAR(300),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE certificates (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    cert_name VARCHAR(20),
    score VARCHAR(20),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `community_comments` (
    id INT NOT NULL AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    is_secret BOOLEAN NULL,
    created_at DATETIME NULL,
    PRIMARY KEY (id),
    INDEX (post_id),
    INDEX (user_id)
);

CREATE TABLE `career_challenges` (
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(30) NOT NULL,
    description VARCHAR(100) NOT NULL,
    is_quiz BOOLEAN NULL,
    quiz_answer VARCHAR(255) NULL,
    created_at DATETIME NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `community_posts` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NULL,
    created_at DATETIME NULL,
    PRIMARY KEY (id),
    INDEX (user_id)
);

CREATE TABLE `community_post_tags` (
    id INT NOT NULL AUTO_INCREMENT,
    post_id INT NOT NULL,
    tag VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX (post_id)
);

CREATE TABLE `job_reviews` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL,
    application_id INT NULL,
    
    company_name VARCHAR(100) NOT NULL,
    experience_level ENUM('entry', 'experienced') NOT NULL,
    interview_date DATE NOT NULL,
    
    overall_evaluation ENUM('positive', 'neutral', 'negative') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    
    interview_review TEXT NOT NULL,
    
    final_result ENUM('final_pass', 'second_pass', 'first_pass', 'fail') NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    INDEX (user_id),
    INDEX (application_id),
    INDEX (company_name),
    INDEX (experience_level),
    INDEX (overall_evaluation),
    INDEX (difficulty),
    INDEX (final_result),
    UNIQUE KEY unique_review_per_application (application_id)
);

CREATE TABLE `job_positions` (
    id INT NOT NULL AUTO_INCREMENT,
    job_review_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    INDEX (job_review_id),
    INDEX (position)
);

CREATE TABLE `interview_questions` (
    id INT NOT NULL AUTO_INCREMENT,
    job_review_id INT NOT NULL,
    question TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    INDEX (job_review_id)
);




CREATE TABLE hopes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    company VARCHAR(20),
    job VARCHAR(30),
    region VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE educations (
    user_id VARCHAR(20) NOT NULL,
    school_name VARCHAR(20),
    major VARCHAR(20),
    admission_year DATE,
    graduation_year DATE,
    status VARCHAR(10),
    score FLOAT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `user_challenge_histories` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL,
    challenge_id INT NOT NULL,
    challenge_date DATE NOT NULL,
    user_answer TEXT NULL,
    is_completed BOOLEAN NULL,
    is_correct BOOLEAN NULL,
    PRIMARY KEY (id),
    INDEX (user_id),
    INDEX (challenge_id)
);



ALTER TABLE `company_contents` ADD CONSTRAINT `FK_companies_TO_company_contents_1`
    FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `company_likes_personal` ADD CONSTRAINT `FK_companies_TO_company_likes_personal_1`
    FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `company_likes_personal` ADD CONSTRAINT `FK_personalusers_TO_company_likes_personal_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `skills` DROP FOREIGN KEY `FK_users_TO_skills_1`;
ALTER TABLE `skills` ADD CONSTRAINT `FK_personalusers_TO_skills_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `university_staff` ADD CONSTRAINT `FK_users_TO_university_staff_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `projects` DROP FOREIGN KEY `FK_users_TO_projects_1`;
ALTER TABLE `projects` ADD CONSTRAINT `FK_personalusers_TO_projects_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `company_users` ADD CONSTRAINT `FK_users_TO_company_users_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `company_users` ADD CONSTRAINT `FK_companies_TO_company_users_1`
    FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `activities` DROP FOREIGN KEY `FK_users_TO_activities_1`;
ALTER TABLE `activities` ADD CONSTRAINT `FK_personalusers_TO_activities_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `certificates` DROP FOREIGN KEY `FK_users_TO_certificates_1`;
ALTER TABLE `certificates` ADD CONSTRAINT `FK_personalusers_TO_certificates_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `community_comments` ADD CONSTRAINT `FK_community_posts_TO_community_comments_1`
    FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`);


ALTER TABLE `community_posts` ADD CONSTRAINT `FK_personalusers_TO_community_posts_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `community_post_tags` ADD CONSTRAINT `FK_community_posts_TO_community_post_tags_1`
    FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`);

ALTER TABLE `hopes` ADD CONSTRAINT `FK_personalusers_TO_hopes_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `educations` ADD CONSTRAINT `FK_personalusers_TO_educations_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `personalusers` ADD CONSTRAINT `FK_users_TO_personalusers_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `user_challenge_histories` ADD CONSTRAINT `FK_personalusers_TO_user_challenge_histories_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `user_challenge_histories` ADD CONSTRAINT `FK_career_challenges_TO_user_challenge_histories_1`
    FOREIGN KEY (`challenge_id`) REFERENCES `career_challenges` (`id`);


CREATE TABLE `company_applications` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    application_date DATETIME NOT NULL,
    status ENUM('preparing_documents','documents_submitted','documents_under_review','documents_passed','documents_failed','preparing_test','test_completed','test_under_review','test_passed','test_failed','preparing_assignment','assignment_submitted','assignment_under_review','assignment_passed','assignment_failed','preparing_interview','interview_completed','interview_under_review','interview_passed','interview_failed','final_accepted','final_rejected','offer_declined') DEFAULT 'preparing_documents',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (user_id),
    FOREIGN KEY (user_id) REFERENCES personalusers(user_id)
);


CREATE TABLE `application_documents` (
    id INT NOT NULL AUTO_INCREMENT,
    application_id INT NOT NULL,
    document_type ENUM('resume', 'cover_letter', 'portfolio', 'certificate', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    original_name VARCHAR(255),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (application_id),
    FOREIGN KEY (application_id) REFERENCES company_applications(id) ON DELETE CASCADE
);


CREATE TABLE `application_schedules` (
    id INT NOT NULL AUTO_INCREMENT,
    application_id INT NOT NULL,
    schedule_type ENUM('document_deadline','document_result_announcement','test_date','test_result_announcement','assignment_deadline','interview_date','interview_result_announcement','final_result_announcement') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (application_id),
    INDEX (start_date),
    FOREIGN KEY (application_id) REFERENCES company_applications(id) ON DELETE CASCADE
);

ALTER TABLE `job_reviews` ADD CONSTRAINT `FK_personalusers_TO_job_reviews_1`
    FOREIGN KEY (`user_id`) REFERENCES `personalusers` (`user_id`);

ALTER TABLE `job_reviews` ADD CONSTRAINT `FK_company_applications_TO_job_reviews_1`
    FOREIGN KEY (`application_id`) REFERENCES `company_applications` (`id`);

ALTER TABLE `job_positions` ADD CONSTRAINT `FK_job_reviews_TO_job_positions_1`
    FOREIGN KEY (`job_review_id`) REFERENCES `job_reviews` (`id`) ON DELETE CASCADE;

ALTER TABLE `interview_questions` ADD CONSTRAINT `FK_job_reviews_TO_interview_questions_1`
    FOREIGN KEY (`job_review_id`) REFERENCES `job_reviews` (`id`) ON DELETE CASCADE;

