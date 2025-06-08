# CryptoRand: Interactive Web Application for Exploring Cryptographic Pseudo-Random Number Generators

**Author:** Anugrah Singh (1AY23CS031)

CryptoRand is an interactive web application designed to demonstrate and educate users on the application of discrete mathematics principles in cryptographic pseudo-random number generators (PRNGs). The project allows users to generate sequences from PRNGs like the Linear Congruential Generator (LCG) and Blum Blum Shub (BBS), visualize their outputs, and learn underlying mathematical concepts through an AI-powered tutor (Gemma 3).

For a detailed explanation of the project, please see [PROJECT_REPORT.md](PROJECT_REPORT.md).

## Tech Stack

*   **Frontend:** Vite with React
*   **Styling:** Tailwind CSS
*   **Visualizations:** Chart.js
*   **Backend:** Flask (Python)
*   **AI Integration:** Gemma 3 (locally hosted via LM Studio)
*   **Mathematical Computations:** NumPy/SciPy
*   **Version Control:** Git

## Running the Project

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the Flask application:
    ```bash
    flask run
    ```
    The backend will typically run on `http://127.0.0.1:5000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the Vite development server:
    ```bash
    npm run dev
    ```
    The frontend will typically be accessible at `http://localhost:5173`.

## Project Report

For a comprehensive understanding of the project, including its goals, technical details, discrete mathematics concepts applied, and educational value, please refer to the [PROJECT_REPORT.md](PROJECT_REPORT.md).
