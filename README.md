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

## Detailed Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Anugrah-Singh/dms_project.git
cd dms_project
```

### 2. Set up LM Studio and Gemma 3

1.  **Download and Install LM Studio:** Go to [https://lmstudio.ai/](https://lmstudio.ai/) and download the version appropriate for your operating system. Install it.
2.  **Download Gemma 3:**
    *   Open LM Studio.
    *   In the search bar (magnifying glass icon on the left), search for "Gemma 3".
    *   Download a Gemma 3 model (e.g., one of the smaller, faster GGUF versions if you are unsure).
3.  **Start the Local Server:**
    *   Go to the "Local Server" tab (server icon, usually `<->` on the left).
    *   Select the downloaded Gemma 3 model from the dropdown at the top.
    *   Click "Start Server". By default, it usually runs on `http://localhost:1234/v1`. Note this address.
    *   Ensure the server is running whenever you use the CryptoRand application.

### 3. Backend Setup (Flask/Python)

1.  **Navigate to the `backend` directory:**

    ```powershell
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    *   If you don't have `virtualenv` installed, install it:

        ```powershell
        pip install virtualenv
        ```

    *   Create the virtual environment:

        ```powershell
        python -m venv venv
        ```

    *   Activate the virtual environment:

        ```powershell
        .\venv\Scripts\Activate.ps1
        ```

        (For bash/zsh on Linux/macOS, it would be `source venv/bin/activate`)
3.  **Install dependencies:**

    ```powershell
    pip install -r requirements.txt
    ```

4.  **(Optional) Configure LM Studio API Endpoint:**
    *   If your LM Studio server is running on a different port or you need to specify it, you might need to configure this in `backend/app.py` or via an environment variable if the application is set up to read it. (Check `app.py` for how the LM Studio URL is determined).
5.  **Run the Flask application:**

    ```powershell
    flask run
    ```

    The backend will typically run on `http://127.0.0.1:5000`.

### 4. Frontend Setup (Vite/React)

1.  **Install Node.js and npm:**
    *   If you don't have Node.js and npm installed, download and install them from [https://nodejs.org/](https://nodejs.org/). It's recommended to install an LTS version.
2.  **Navigate to the `frontend` directory:**

    ```powershell
    cd ..\frontend 
    ```

    (Assuming you are in the `backend` directory from the previous step. If you are in the project root, just `cd frontend`)
3.  **Install dependencies:**

    ```powershell
    npm install
    ```

4.  **Run the Vite development server:**

    ```powershell
    npm run dev
    ```

    The frontend will typically be accessible at `http://localhost:5173` (or another port if 5173 is busy, Vite will tell you). Open this URL in your web browser.

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
