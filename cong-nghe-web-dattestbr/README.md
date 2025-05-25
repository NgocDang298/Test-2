# API Documentation

## Authentication Endpoints

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
    "username": "string",
    "password": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
        "accessToken": "string",
        "refreshToken": "string"
    }
}
```

### Change Password
- **Endpoint**: `PUT /api/auth/change-password`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "oldPassword": "string",
    "newPassword": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Mật khẩu đã được thay đổi thành công",
    "data": null
}
```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Request Body**:
```json
{
    "refreshToken": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Token mới",
    "data": {
        "accessToken": "string",
        "refreshToken": "string"
    }
}
```

## Admin Endpoints

### User Management

#### Update Student
- **Endpoint**: `PUT /api/admin/students/update/{studentId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "fullname": "string",
    "email": "string",
    "phone": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Thông tin sinh viên có ID {studentId} đã được cập nhật.",
    "data": null
}
```

#### Update Teacher
- **Endpoint**: `PUT /api/admin/teachers/update/{teacherId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "fullname": "string",
    "email": "string",
    "phone": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Thông tin giáo viên có ID {teacherId} đã được cập nhật.",
    "data": null
}
```

#### Get Users by Role
- **Endpoint**: `GET /api/admin/users/role/{role}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "success": true,
    "message": "Found {count} user(s) with role {role}.",
    "data": [
        {
            "id": "long",
            "username": "string",
            "fullname": "string",
            "email": "string",
            "phone": "string",
            "role": "string"
        }
    ]
}
```

#### Delete Student
- **Endpoint**: `DELETE /api/admin/student/delete/{studentId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "success": true,
    "message": "Sinh viên đã được xóa thành công",
    "data": null
}
```

#### Delete Teacher
- **Endpoint**: `DELETE /api/admin/teacher/delete/{teacherId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "success": true,
    "message": "Giáo viên đã được xóa thành công",
    "data": null
}
```

#### Register Teacher
- **Endpoint**: `POST /api/admin/teachers/register`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "username": "string",
    "password": "string",
    "fullname": "string",
    "email": "string",
    "phone": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Đã đăng ký thành công tài khoản cho giáo viên: {username}",
    "data": null
}
```

### Subject Management

#### Get Pending Subjects
- **Endpoint**: `GET /api/admin/subjects/pending`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "id": "integer",
    "name": "string",
    "description": "string",
    "status": "integer"
}
```

#### Approve Subject
- **Endpoint**: `POST /api/admin/subjects/{id}/approve`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: 200 OK

#### Reject Subject
- **Endpoint**: `POST /api/admin/subjects/{id}/reject`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: 200 OK

#### Assign Teacher to Subject
- **Endpoint**: `POST /api/admin/subjects/{subjectId}/assign-teacher/{teacherId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: 200 OK

#### Remove Teacher from Subject
- **Endpoint**: `DELETE /api/admin/subjects/{subjectId}/remove-teacher/{teacherId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: 200 OK

#### Get Teachers for Subject
- **Endpoint**: `GET /api/admin/subjects/{subjectId}/teachers`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of User objects

## Teacher Endpoints

### Update Teacher Info
- **Endpoint**: `PUT /api/teacher/update-info`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "fullname": "string",
    "email": "string",
    "phone": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Thông tin giáo viên đã được cập nhật.",
    "data": null
}
```

### Get All Students
- **Endpoint**: `GET /api/teacher/student/findall`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "success": true,
    "message": "Danh sách sinh viên.",
    "data": [
        {
            "id": "long",
            "username": "string",
            "fullname": "string",
            "email": "string",
            "phone": "string",
            "role": "string"
        }
    ]
}
```

## Student Endpoints

### Update Student Info
- **Endpoint**: `PUT /api/student/update-info`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "fullname": "string",
    "email": "string",
    "phone": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Thông tin sinh viên đã được cập nhật.",
    "data": null
}
```

## Subject Endpoints

### Create Subject
- **Endpoint**: `POST /api/teacher/subjects`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "name": "string",
    "description": "string"
}
```
- **Response**:
```json
{
    "id": "integer",
    "name": "string",
    "description": "string",
    "status": "integer"
}
```

### Update Subject
- **Endpoint**: `PUT /api/teacher/subjects/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Request Body**:
```json
{
    "name": "string",
    "description": "string"
}
```
- **Response**:
```json
{
    "id": "integer",
    "name": "string",
    "description": "string",
    "status": "integer"
}
```

### Get Subject by ID
- **Endpoint**: `GET /api/teacher/subjects/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**:
```json
{
    "id": "integer",
    "name": "string",
    "description": "string",
    "status": "integer"
}
```

### Get All Subjects
- **Endpoint**: `GET /api/teacher/subjects`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of SubjectResponse objects

### Add Student to Subject
- **Endpoint**: `POST /api/teacher/subjects/{subjectId}/students/{studentId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: 200 OK with message "Học sinh đã được thêm vào môn học."

### Get Students in Subject
- **Endpoint**: `GET /api/teacher/subjects/{subjectId}/students`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of User objects

### Get Subjects for Student
- **Endpoint**: `GET /api/student/{studentId}/subjects`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of SubjectResponse objects

## Exam Endpoints

### Create Exam
- **Endpoint**: `POST /api/exams`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Id: long
  - X-User-Role: string
- **Request Body**: Exam object
- **Response**: Created Exam object

### Update Exam
- **Endpoint**: `PUT /api/exams/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Request Body**: Exam object
- **Response**: Updated Exam object

### Delete Exam
- **Endpoint**: `DELETE /api/exams/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: 204 No Content

### Get Exam by ID
- **Endpoint**: `GET /api/exams/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: Exam object

### Get Exams by Subject
- **Endpoint**: `GET /api/exams/subject/{subjectId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of Exam objects

## Question Endpoints

### Add Question to Exam
- **Endpoint**: `POST /api/questions/exam/{examId}/question-bank/{questionBankId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: Question object

### Remove Question from Exam
- **Endpoint**: `DELETE /api/questions/exam/{examId}/question-bank/{questionBankId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: 204 No Content

### Get Questions by Exam
- **Endpoint**: `GET /api/questions/exam/{examId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of Question objects

## Choice Endpoints

### Create Choice
- **Endpoint**: `POST /api/choices/question/{questionBankId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Request Body**:
```json
{
    "choiceText": "string",
    "isCorrect": "boolean"
}
```
- **Response**: ChoiceResponse object

### Update Choice
- **Endpoint**: `PUT /api/choices/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Request Body**: Choice object
- **Response**: Updated Choice object

### Delete Choice
- **Endpoint**: `DELETE /api/choices/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: 204 No Content

### Get Choices by Question
- **Endpoint**: `GET /api/choices/question/{questionBankId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of Choice objects

## Submission Endpoints

### Create Submission
- **Endpoint**: `POST /api/submissions/exam/{examId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Id: long
  - X-User-Role: string
- **Response**: Created Submission object

### Get Submission by ID
- **Endpoint**: `GET /api/submissions/{id}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: Submission object

### Get Submissions by Exam
- **Endpoint**: `GET /api/submissions/exam/{examId}`
- **Headers**: 
  - Authorization: Bearer {token}
- **Response**: List of Submission objects

## Answer Endpoints

### Create Answer
- **Endpoint**: `POST /api/answers/submission/{submissionId}/question/{questionId}/choice/{choiceId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: Answer object

## Essay Answer Endpoints

### Create Essay Answer
- **Endpoint**: `POST /api/essay-answers/submission/{submissionId}/question/{questionId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Request Body**: String (answer text)
- **Response**: EssayAnswer object

## Grading Endpoints

### Grade Submission
- **Endpoint**: `POST /api/grading/submission/{submissionId}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: Graded Submission object

### Grade Essay Answer
- **Endpoint**: `POST /api/grading/essay-answer/{essayAnswerId}/score/{score}`
- **Headers**: 
  - Authorization: Bearer {token}
  - X-User-Role: string
- **Response**: 200 OK 