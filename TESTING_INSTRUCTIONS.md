# CryptoRand Application Testing Instructions

This document provides instructions for testing the CryptoRand web application.

## 1. Prerequisites

Before you begin testing, ensure the following are set up and running:

1.  **Backend Flask Server:**
    *   Navigate to the `backend` directory: `cd c:\Users\risky\Code\dms_project\backend`
    *   Activate your Python virtual environment if you have one.
    *   Install dependencies: `pip install -r requirements.txt`
    *   Run the Flask app: `python app.py` (or `flask run`)
    *   The backend should be running, typically on `http://127.0.0.1:5000/`.

2.  **Frontend Vite Development Server:**
    *   Navigate to the `frontend` directory: `cd c:\Users\risky\Code\dms_project\frontend`
    *   Install dependencies: `npm install`
    *   Run the Vite dev server: `npm run dev`
    *   The frontend should be accessible, typically at `http://localhost:5173/`.

3.  **LM Studio with Gemma 3 Model:**
    *   Start LM Studio.
    *   Load the `google/gemma-3` (or the specific version you configured, e.g., `gemma-3-4b`) model.
    *   Start the server from the "Local Server" tab in LM Studio.
    *   Ensure the server is running on the configured port (default in `backend/app.py` is `http://localhost:1234/v1/chat/completions`).

## 2. Accessing the Application

Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173/`). You should see the CryptoRand application interface with different tabs.

## 3. Testing Procedures

### 3.1. LCG (Linear Congruential Generator) Tab

1.  **Parameter Input & Validation:**
    *   Enter valid integer values for `Seed (X0)`, `Multiplier (a)`, `Increment (c)`, and `Modulus (m)`.
    *   Enter a valid integer for `Count (Number of values to generate)`.
    *   **Test Case:** `Seed=1`, `a=5`, `c=3`, `m=16`, `Count=10`.
    *   Click "Generate LCG Sequence".
    *   **Expected:** A sequence of numbers should be displayed. Histograms and scatter plots should update.
    *   Try invalid inputs (e.g., non-integers, negative modulus, count <= 0).
    *   **Expected:** Appropriate error messages should be displayed. No sequence should be generated.
    *   Try edge cases (e.g., `a=0`, `c=0`, `m=1`).

2.  **Sequence Generation:**
    *   Verify that the generated sequence matches the LCG formula: `X_{n+1} = (a * X_n + c) mod m`.
    *   Check if the correct number of values is generated.

3.  **Chart Visualizations:**
    *   **Histogram:** Verify it displays the frequency distribution of the generated numbers.
    *   **Scatter Plot (Xn vs Xn+1):** Verify it plots pairs of consecutive numbers and helps visualize patterns.
    *   Change LCG parameters and observe how the charts update.

4.  **Chi-squared Test:**
    *   Generate a sequence (e.g., `Seed=7, a=1103515245, c=12345, m=2^31, Count=1000`).
    *   Click "Run Chi-squared Test".
    *   **Expected:** The Chi-squared statistic and p-value should be displayed. An interpretation (e.g., "The sequence appears to be uniformly distributed" or "The sequence may not be uniformly distributed") should be shown.
    *   Test with a small, non-random sequence.
    *   **Expected:** The test should indicate non-randomness.
    *   Test with no sequence generated.
    *   **Expected:** An error message or disabled button.

5.  **AI Tutor:**
    *   Generate a sequence.
    *   In the "Ask AI Tutor" section, type a question related to LCGs or the current output (e.g., "Explain this LCG's parameters", "What does the scatter plot show?").
    *   Click "Get Explanation".
    *   **Expected:** An explanation from the AI (Gemma 3 via LM Studio) should appear.
    *   Test with an empty query.
    *   **Expected:** An appropriate message (e.g., "Please enter a question").

### 3.2. BBS (Blum Blum Shub) Tab

1.  **Parameter Input & Validation:**
    *   Enter valid integer values for `p`, `q`, and `Seed (X0)`. `p` and `q` must be prime numbers congruent to 3 mod 4. The seed must be coprime to `n = p*q`.
    *   Enter a valid integer for `Count (Number of bits to generate)`.
    *   **Test Case:** `p=11`, `q=19`, `Seed=3`, `Count=100`.
    *   Click "Generate BBS Sequence".
    *   **Expected:** A sequence of bits (0s and 1s) should be displayed. The bit distribution chart should update.
    *   Try invalid inputs:
        *   `p` or `q` not prime (e.g., `p=10`).
        *   `p` or `q` not congruent to 3 mod 4 (e.g., `p=7`, `q=13` - 13 is 1 mod 4).
        *   `p = q`.
        *   Seed not coprime to `n` (e.g., `p=7, q=11, n=77, Seed=7`).
        *   Seed <= 1 or seed >= n.
    *   **Expected:** Appropriate error messages should be displayed. No sequence should be generated.

2.  **Sequence Generation:**
    *   Verify that the generated sequence matches the BBS formula: `X_{i+1} = X_i^2 mod n`, with the output bit being the LSB of `X_{i+1}`.
    *   Check if the correct number of bits is generated.

3.  **Chart Visualizations:**
    *   **Bit Distribution Chart:** Verify it displays the count of 0s and 1s in the generated sequence.
    *   Change BBS parameters and observe how the chart updates.

4.  **Chi-squared Test:**
    *   Generate a sequence (e.g., `p=11, q=19, Seed=3, Count=1000`).
    *   Click "Run Chi-squared Test".
    *   **Expected:** The Chi-squared statistic and p-value for bit distribution should be displayed, along with an interpretation.
    *   Test with a sequence of all 0s or all 1s (if possible to force, or by manually inputting if the feature existed).
    *   **Expected:** The test should indicate non-randomness.

5.  **AI Tutor:**
    *   Generate a sequence.
    *   Ask a question related to BBS or the current output (e.g., "Explain why p and q must be 3 mod 4", "Is this BBS sequence good for cryptography?").
    *   Click "Get Explanation".
    *   **Expected:** An AI-generated explanation should appear.

### 3.3. Learn & Explore Tab

1.  **Content Display:**
    *   Navigate to the "Learn & Explore" tab.
    *   **Expected:** Educational content about PRNGs, LCG, and BBS should be visible and well-formatted.

2.  **Interactive LCG Exercise:**
    *   Locate the "Interactive LCG Exercise".
    *   Adjust parameters (`a`, `c`, `m`, `seed`, `count`).
    *   **Expected:** The generated sequence should update immediately on the client-side.
    *   Verify calculations are correct.
    *   Test edge cases and invalid inputs (though client-side validation might be simpler here).

3.  **Interactive BBS Exercise:**
    *   Locate the "Interactive BBS Exercise".
    *   Adjust parameters (`p`, `q`, `seed`, `count`).
    *   **Expected:** The generated bit sequence should update immediately.
    *   Verify calculations and primality/congruence checks for `p` and `q`.
    *   Test invalid inputs for `p` and `q`.
    *   **Expected:** Error messages should appear if parameters are invalid.

### 3.4. Crypto Demo Tab

1.  **Message Input:**
    *   Enter a test message in the "Message to Encrypt" textarea (e.g., "Hello Crypto!").

2.  **BBS Parameter Input:**
    *   Enter valid BBS parameters (`p`, `q`, `seed`) as per BBS requirements.
    *   **Test Case:** `p=11`, `q=19`, `seed=3`.

3.  **Encryption/Decryption Process:**
    *   Click "Generate Keystream & Encrypt/Decrypt".
    *   **Expected:**
        *   A keystream (first 100 bits) should be displayed.
        *   An encrypted message (in hex format) should be displayed.
        *   The decrypted message should match the original input message.
    *   Try invalid BBS parameters.
    *   **Expected:** An error message should be displayed. No encryption/decryption should occur.
    *   Try an empty message.
    *   **Expected:** An error message "Please enter a message to encrypt."

4.  **Output Verification:**
    *   **Keystream:** Verify it's a sequence of bits.
    *   **Encrypted Message (Hex):** Verify it's a hexadecimal string.
    *   **Decrypted Message:** Critically, ensure it exactly matches the original plaintext message.
    *   If possible, manually verify a short encryption/decryption with a known short keystream.

### 3.5. General UI/UX and Responsiveness

1.  **Navigation:**
    *   Ensure smooth navigation between tabs.
    *   **Expected:** Content for each tab loads correctly.

2.  **Responsiveness:**
    *   Resize the browser window to different sizes (desktop, tablet, mobile).
    *   **Expected:** The layout should adapt gracefully. Elements should not overlap or become unusable. Tailwind CSS classes should handle this.

3.  **Clarity and Readability:**
    *   Check if all text, labels, and instructions are clear and easy to understand.
    *   Ensure error messages are informative.

4.  **Visual Appeal:**
    *   Assess the overall look and feel. Is it modern, clean, and engaging as per project requirements?
    *   Check consistency in styling (fonts, colors, spacing).

5.  **Error Handling:**
    *   Beyond specific input validations, try to trigger other errors (e.g., if the backend server is down, if LM Studio is not running).
    *   **Expected:** The application should handle these errors gracefully, ideally showing a user-friendly message instead of crashing or showing raw error data.

## 4. Reporting Issues

When reporting issues, please include:
*   A clear description of the issue.
*   Steps to reproduce the issue.
*   The tab and specific component/feature involved.
*   Expected behavior vs. Actual behavior.
*   Screenshots or console logs, if applicable.

---
Good luck with testing!
