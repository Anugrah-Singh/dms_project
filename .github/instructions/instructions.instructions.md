You are a highly capable AI model tasked with assisting in the development of a software project called CryptoRand. This project is an interactive web application designed to demonstrate the application of discrete mathematics in cryptographic pseudo-random number generators (PRNGs). It is intended to be a showcase project created by a student for a discrete mathematics teacher, to be presented publicly, so it must be educational, visually appealing, and cutting-edge. The project uses modern technologies and integrates a locally hosted large language model (LLM), specifically Gemma 3, for AI-driven explanations.

Project Overview

CryptoRand educates users about PRNGs rooted in discrete mathematics, such as the Linear Congruential Generator (LCG) and Blum Blum Shub (BBS), with interactive visualizations and AI-powered tutoring. The application will allow users to:





Generate PRNG sequences by adjusting parameters (e.g., seed, modulus).



Visualize PRNG outputs (e.g., histograms, scatter plots).



Learn discrete math concepts (e.g., modular arithmetic, finite fields) and their cryptographic applications via an AI tutor powered by Gemma 3.



Explore simple cryptographic demonstrations (e.g., key generation).



Engage with interactive educational modules and exercises.

Tech Stack





Frontend: Vite with React (for a fast, dynamic UI), Tailwind CSS (for styling), Chart.js (for visualizations).



Backend: Flask (Python) for PRNG computations and API handling.



AI Integration: Gemma 3, locally hosted via LM Studio, for generating explanations, analyzing PRNG outputs, and answering user queries.



Additional Tools: NumPy/SciPy (for math computations), Git (version control).



Deployment: Local for development; optional cloud deployment (e.g., Heroku) for showcases.

Key Requirements





PRNG Implementations:





Implement LCG (using modular arithmetic) and BBS (using quadratic residues and finite fields).



Allow users to input parameters (e.g., seed, modulus, multiplier) and generate sequences.



Include statistical tests (e.g., chi-square) to analyze randomness.



Visualizations:





Use Chart.js to create real-time graphs (e.g., histograms, scatter plots) showing PRNG output distributions.



Highlight patterns or cycles to demonstrate PRNG strengths and weaknesses.



AI Integration:





Use Gemma 3, hosted locally via LM Studio, to provide:





Explanations of discrete math concepts (e.g., modular arithmetic, entropy).



Insights into PRNG use in cryptography (e.g., key generation).



Real-time analysis of PRNG outputs (e.g., statistical properties).



Integrate LM Studio’s API with Flask to handle AI requests and responses.



Educational Modules:





Create guided lessons on discrete math and PRNGs.



Include interactive exercises where users tweak PRNG parameters and observe changes.



Ensure AI explanations are clear and accessible to non-experts.



Showcase Appeal:





Design a clean, intuitive UI with Tailwind CSS for a professional, engaging look.



Ensure the application is user-friendly for public demonstrations.



Include a demo mode showing PRNGs in a cryptographic context (e.g., key generation for encryption).