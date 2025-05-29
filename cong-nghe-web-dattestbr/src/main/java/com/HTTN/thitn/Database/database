-- Bảng người dùng
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  fullname VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng vai trò
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- Bảng phân quyền
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Bảng Refresh Token
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expiry_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng môn học
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  status INT NOT NULL DEFAULT 0, -- 0 là 'PENDING', 1 là 'APPROVED', 2 là 'REJECTED'
  created_at TIMESTAMP DEFAULT NOW()
);

--Bảng phân quyền môn hc cho giáo viên
CREATE TABLE subject_teachers (
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (subject_id, teacher_id)
);

--Bảng phân quyền môn hc cho học sinh
CREATE TABLE subject_students (
    subject_id INT NOT NULL,
    student_id BIGINT NOT NULL,
    PRIMARY KEY (subject_id, student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Bảng ngân hàng câu hỏi
CREATE TABLE question_bank (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type INTEGER NOT NULL CHECK (question_type = ANY (ARRAY[1, 2, 3, 4])), --1 → multiple_choice  2 → multiple_select  3 → true_false  4 → short_answer
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng đề thi
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- phút
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng liên kết đề thi với câu hỏi
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  question_bank_id INTEGER REFERENCES question_bank(id) ON DELETE CASCADE
);

-- Bảng đáp án
CREATE TABLE choices (
  id SERIAL PRIMARY KEY,
  question_bank_id INTEGER REFERENCES question_bank(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

-- Bảng bài làm
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  score FLOAT DEFAULT 0,
  submit_time TIMESTAMP NULL,
  status INTEGER DEFAULT 0, -- 0 là chưa nộp, 1 là đã nộp
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng câu trả lời trắc nghiệm
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  chosen_choice_id INTEGER REFERENCES choices(id) ON DELETE SET NULL
);

-- Bảng câu trả lời tự luận
CREATE TABLE essay_answers (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL
);

-- Thêm vai trò
INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('TEACHER');
INSERT INTO roles (name) VALUES ('STUDENT');

-- Thay thế 'password_hash_placeholder' bằng mật khẩu đã băm
INSERT INTO users (username, password_hash, fullname, email) VALUES
('admin_user', '$2a$10$cLYH6jtosUj6Ly94lY3m0uKv5tmVWkKcEbM2h8coryIsQ465XGDK6', 'Admin User', 'admin@example.com'),
('teacher_user', '$2a$10$/tk2XokfBUL9XdYaosWCwOcLvwhFGNfzabK8vtPJFvz9gZaFMrkNy', 'Teacher User', 'teacher@example.com'),
('student_user', '$2a$10$xRnt2lILp5S2lAScQ9EI8.ewu.ncQ5NEjyVeyk/wwEpo8Iw7F.HLm', 'Student User', 'student@example.com');

-- Gán vai trò cho người dùng
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin_user là ADMIN
(2, 2), -- teacher_user là TEACHER
(3, 3); -- student_user là STUDENT