# English API Documentation

This repository contains the API for managing groups, lessons, payments, and posts for an English language teaching platform. The API is built using AWS Lambda, integrated with the Serverless Framework.

## Base URL

```
https://{your-api-gateway-url}/dev
```

---

## Endpoints

### **Groups**

#### Create a Group

- **URL:** `/groups`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "level": "Intermediate",
    "schedule": [
      { "day": "Monday", "time": "18:00" },
      { "day": "Wednesday", "time": "18:00" }
    ],
    "price": 15,
    "description": "Business English for professionals"
  }
  ```
- **Response:**
  ```json
  {
    "id": "groupId",
    "level": "Intermediate",
    "schedule": [...],
    "price": 15,
    "description": "Business English for professionals"
  }
  ```

#### Get a Group by ID

- **URL:** `/groups/{id}`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": "groupId",
    "level": "Intermediate",
    "schedule": [...],
    "price": 15,
    "description": "Business English for professionals"
  }
  ```

#### Get All Groups

- **URL:** `/groups`
- **Method:** `GET`
- **Response:**
  ```json
  [
    { "id": "groupId1", "level": "Intermediate", ... },
    { "id": "groupId2", "level": "Advanced", ... }
  ]
  ```

#### Update a Group

- **URL:** `/groups/{id}`
- **Method:** `PUT`
- **Request Body:** Same as Create a Group.
- **Response:** Updated group object.

#### Delete a Group

- **URL:** `/groups/{id}`
- **Method:** `DELETE`
- **Response:**
  ```json
  { "message": "Group deleted successfully" }
  ```

#### Add a Student to a Group

- **URL:** `/groups/{id}/students`
- **Method:** `POST`
- **Request Body:**
  ```json
  { "userId": "userId" }
  ```
- **Response:** Updated group object.

#### Remove a Student from a Group

- **URL:** `/groups/{id}/students`
- **Method:** `DELETE`
- **Request Body:** Same as Add a Student to a Group.
- **Response:** Updated group object.

---

### **Lessons**

#### Create a Lesson

- **URL:** `/lessons`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "userId": "userId",
    "groupId": "groupId",
    "dateTime": "2024-01-01T10:00:00Z",
    "notes": "Introduction to Business English"
  }
  ```
- **Response:** Created lesson object.

#### Get a Lesson by ID

- **URL:** `/lessons/{id}`
- **Method:** `GET`
- **Response:** Lesson object.

#### Get All Lessons

- **URL:** `/lessons`
- **Method:** `GET`
- **Response:** Array of lesson objects.

#### Get Lessons by Group

- **URL:** `/lessons/groups/{groupId}`
- **Method:** `GET`
- **Response:** Array of lessons for the group.

#### Get Lessons by User

- **URL:** `/lessons/users/{userId}`
- **Method:** `GET`
- **Response:** Array of lessons for the user.

#### Update a Lesson

- **URL:** `/lessons/{id}`
- **Method:** `PUT`
- **Request Body:** Same as Create a Lesson.
- **Response:** Updated lesson object.

#### Delete a Lesson

- **URL:** `/lessons/{id}`
- **Method:** `DELETE`
- **Response:**
  ```json
  { "message": "Lesson deleted successfully" }
  ```

#### Mark Attendance

- **URL:** `/lessons/{id}/attendance`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  { "attendance": "present" }
  ```
- **Response:** Updated lesson object.

---

### **Payments**

#### Create a Payment

- **URL:** `/payments`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "userId": "userId",
    "amount": 100,
    "method": "LiqPay",
    "status": "successful"
  }
  ```
- **Response:** Created payment object.

#### Get a Payment by ID

- **URL:** `/payments/{id}`
- **Method:** `GET`
- **Response:** Payment object.

#### Get All Payments

- **URL:** `/payments`
- **Method:** `GET`
- **Response:** Array of payment objects.

#### Update Payment Status

- **URL:** `/payments/{id}/status`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  { "status": "failed" }
  ```
- **Response:** Updated payment object.

#### Delete a Payment

- **URL:** `/payments/{id}`
- **Method:** `DELETE`
- **Response:**
  ```json
  { "message": "Payment deleted successfully" }
  ```

---

### **Posts**

#### Create a Post

- **URL:** `/posts`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "5 Tips for Learning English",
    "body": "Practice every day...",
    "topic": "Learning Tips",
    "hashtags": ["#English", "#Tips"]
  }
  ```
- **Response:** Created post object.

#### Get a Post by ID

- **URL:** `/posts/{id}`
- **Method:** `GET`
- **Response:** Post object.

#### Get All Posts

- **URL:** `/posts`
- **Method:** `GET`
- **Response:** Array of post objects.

#### Get Posts by Topic

- **URL:** `/posts/topic`
- **Method:** `GET`
- **Query Parameters:**
  ```json
  { "topic": "Learning Tips" }
  ```
- **Response:** Array of posts for the topic.

#### Update a Post

- **URL:** `/posts/{id}`
- **Method:** `PUT`
- **Request Body:** Same as Create a Post.
- **Response:** Updated post object.

#### Delete a Post

- **URL:** `/posts/{id}`
- **Method:** `DELETE`
- **Response:**
  ```json
  { "message": "Post deleted successfully" }
  ```

---

## Notes

- All endpoints support **CORS**.
- Replace `{your-api-gateway-url}` with your actual API Gateway URL.
- All responses are JSON formatted.
- Fields like `id`, `userId`, and `groupId` are placeholders and should be replaced with actual values from your database.
