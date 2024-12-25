How to Run:

```
npm install
npm start 
```

This BE is using mysql need to create table on my sql

```
CREATE TABLE Employees (
    id CHAR(36) PRIMARY KEY NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    position VARCHAR(50) NULL,
    department VARCHAR(100) NULL,
    salary DECIMAL(10, 2) NULL
);

CREATE TABLE Users (
    user_name VARCHAR(100) PRIMARY KEY NOT NULL,
    employee_id CHAR(36) NULL,
    hashed_password VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (employee_id) REFERENCES Employees(id)
)

CREATE TABLE UserRoles (
    user_name VARCHAR(100) NOT NULL,
    role_name VARCHAR(10) NOT NULL,
    PRIMARY KEY (user_name, role_name),
    FOREIGN KEY (user_name) REFERENCES Users(user_name)
)

CREATE TABLE Attendances (
    id CHAR(36) PRIMARY KEY NOT NULL,
    employee_id CHAR(36) NULL,
    check_in_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES Employees(id)
);

CREATE TABLE AttendanceProofs (
    id CHAR(36) PRIMARY KEY NOT NULL,
    attendace_id CHAR(36) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (attendace_id) REFERENCES Attendances(id)
);

```
