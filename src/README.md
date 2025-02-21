
## **Project Overview**  
This project is a backend service that manages user data and implements Twitter OAuth authentication. It allows CSV uploads for user data, user management, database backup/restore, and Twitter login. The APIs are built using Node.js, Express.js, and PostgreSQL.  

---

## **How to Set Up and Run the Project**  

### **1. Clone the Repository**  
Start by cloning the project repository from GitHub:  

```bash  
git clone <your-repository-url>  
cd <your-project-directory>  
```  

### **2. Install Dependencies**  
Install all required packages using:  

```bash  
npm install  
```  

### **3. Create and Configure the `.env` File**  
In the root of the project directory, create a `.env` file with the following keys:  

```env  
# PostgreSQL Database Configuration  
DB_HOST=localhost  
DB_PORT=5432  
DB_USER=your_postgres_user  
DB_PASSWORD=your_postgres_password  
DB_NAME=your_database_name  

# Twitter OAuth Configuration  
TWITTER_CONSUMER_KEY=your_twitter_consumer_key  
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret  
TWITTER_CALLBACK_URL=http://localhost:8080/auth/twitter/callback  

# Server Port  
PORT=8080 
AUTH_MIDDLEWARE=true

SESSION_SECRET=your_session_secret_here 

EMAIL_USER=your_mail_address
EMAIL_PASS=your_mail_password

PORT=8080

JWT_SECRET=your_secret_key_here
```  

### **4. Database Setup**  
- Ensure PostgreSQL is installed and running on your system.  
- Create the database using your PostgreSQL client or CLI.   

### **5. Start the Server**  
Run the project using:  

```bash  
npm start  
```  

The server will be available at `http://localhost:8080`.  

---

## **How to Configure Environment Variables**  

- **DB_HOST**: The host address for your PostgreSQL database. Typically `localhost`.  
- **DB_PORT**: The port PostgreSQL is running on. Default is `5432`.  
- **DB_USER**: Your PostgreSQL username.  
- **DB_PASSWORD**: Your PostgreSQL password.  
- **DB_NAME**: Name of the database you created for this project.  
- **TWITTER_CONSUMER_KEY**: Consumer Key from your Twitter Developer App.  
- **TWITTER_CONSUMER_SECRET**: Consumer Secret from your Twitter Developer App.  
- **TWITTER_CALLBACK_URL**: URL to handle Twitter OAuth callbacks. Ensure this matches your Twitter Developer settings.  

---

## **Example API Responses**  

1. **POST /api/upload** – Upload CSV and store user data  
   **Success Response:**  
   ```json  
   {  
     "message": "Data uploaded successfully. Notifications sent to users."  
   }  
   ```  
   **Error Response:**  
   ```json  
   {  
     "error": "Invalid file format. Please upload a valid CSV file."  
   }  
   ```  

2. **GET /api/users** – View all stored user data  
   **Success Response:**  
   ```json  
   [  
     {  
       "name": "John Doe",  
       "email": "johndoe@example.com",  
       "username": "johndoe",  
       "address": "123 Street",  
       "role": "USER"  
     }  
   ]  
   ```  

3. **GET /auth/twitter** – Initiate Twitter Authentication  
   This will redirect the user to Twitter’s login page.  

4. **GET /auth/twitter/callback** – Handle Twitter OAuth callback  
   **Success Response:**  
   ```json  
   {  
     "message": "User authenticated successfully.",  
     "user": {  
       "name": "Jane Doe",  
       "twitter_id": "1234567890"  
     }  
   }  
   ```  

---

## **Swagger API Documentation**  

Swagger is integrated to provide a simple and interactive way to explore the API endpoints. To access it:  

1. Run the server (`npm start`).  
2. Navigate to `http://localhost:8080/api-docs` in your browser.  
3. You’ll see a full list of API endpoints, their descriptions, and example requests/responses.  
