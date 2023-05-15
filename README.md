[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Colleague-Feedback-Team-1_colleague-feedback-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Colleague-Feedback-Team-1_colleague-feedback-backend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Colleague-Feedback-Team-1_colleague-feedback-backend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Colleague-Feedback-Team-1_colleague-feedback-backend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Colleague-Feedback-Team-1_colleague-feedback-backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Colleague-Feedback-Team-1_colleague-feedback-backend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Colleague-Feedback-Team-1_colleague-feedback-backend&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Colleague-Feedback-Team-1_colleague-feedback-backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Colleague-Feedback-Team-1_colleague-feedback-backend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Colleague-Feedback-Team-1_colleague-feedback-backend)

# Colleague Feedback Backend

## Table of Contents

1. [About](#about)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)

## About <a name = "about"></a>

This is the backend repository for the Colleague Feedback project.

## Prerequisites <a name = "prerequisites"></a>

You need to have Git and Docker on your mashine.

## Installation <a name = "installation"></a>

Follow the steps below to set up the Colleague Feedback Backend:

1.  Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Colleague-Feedback-Team-1/colleague-feedback-frontend.git
    ```

2. Navigate to the project directory:
   ```bash
   cd colleague-feedback-backend
   ```
   Use Docker Compose to build and run the Docker containers:
   ```bash
   docker-compose up --build -d
   ```
   This command will download all the necessary Docker images, build your Docker containers, and start them. The -d option will run them in the background.

## Usage <a name = "usage"></a>

Once the Docker container is up and running, the backend application will be accessible at http://localhost:4500 (replace 4500 with your actual port if you changed it in the .env file or docker-compose.yml).
