from flask import Flask, request, jsonify, Response # Modified import
from flask_cors import CORS
import numpy as np
import requests # Added for LM Studio integration
from collections import Counter # For Chi-squared test
from scipy.stats import chi2 # For Chi-squared test
import json # Added for parsing SSE data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Helper function for GCD
def gcd(a, b):
    while b:
        a, b = b, a % b
    return abs(a)

# Helper function for Primality Test (simple version)
def is_prime(num):
    if num < 2:
        return False
    if num == 2:
        return True
    if num % 2 == 0:
        return False
    i = 3
    while i * i <= num:
        if num % i == 0:
            return False
        i += 2
    return True

def bbs(p, q, seed, count):
    """
    Blum Blum Shub (BBS) PRNG
    x_{i+1} = (x_i^2) mod n
    Output is the least significant bit of x_i
    """
    if not (is_prime(p) and p % 4 == 3):
        raise ValueError("p must be a prime number congruent to 3 (mod 4).")
    if not (is_prime(q) and q % 4 == 3):
        raise ValueError("q must be a prime number congruent to 3 (mod 4).")
    if p == q:
        raise ValueError("p and q must be distinct primes.")

    n = p * q

    if not (isinstance(seed, int) and 1 < seed < n):
        raise ValueError(f"Seed must be an integer between 1 and n-1 (n={n}).")
    if gcd(seed, n) != 1:
        raise ValueError(f"Seed must be co-prime to n (n={n}). gcd(seed, n) != 1.")
    if not (isinstance(count, int) and count > 0):
        raise ValueError("Count must be a positive integer.")


    bits = []
    x = (seed * seed) % n # x_0 = s^2 mod n
    for _ in range(count):
        x = (x * x) % n # x_{i+1} = x_i^2 mod n
        bits.append(x % 2) # Output is the LSB of x_i
    return bits

def lcg(seed, a, c, m, count):
    """
    Linear Congruential Generator (LCG)
    X_{n+1} = (a * X_n + c) mod m
    """
    if m == 0:
        raise ValueError("Modulus (m) cannot be zero.")
    if not all(isinstance(val, int) for val in [seed, a, c, m, count]):
        raise ValueError("All parameters must be integers.")
    if not all(val >= 0 for val in [seed, a, c, m, count]):
        raise ValueError("All parameters must be non-negative.")
    if count <= 0:
        raise ValueError("Count must be a positive integer.")

    numbers = []
    x = seed
    for _ in range(count):
        x = (a * x + c) % m
        numbers.append(x)
    return numbers

@app.route('/api/lcg', methods=['POST'])
def generate_lcg():
    data = request.get_json()
    try:
        seed = int(data.get('seed'))
        a = int(data.get('multiplier'))  # 'a'
        c = int(data.get('increment'))   # 'c'
        m = int(data.get('modulus'))     # 'm'
        count = int(data.get('count', 10)) # Number of values to generate

        if None in [seed, a, c, m]:
            return jsonify({"error": "Missing one or more parameters: seed, multiplier, increment, modulus"}), 400

        generated_numbers = lcg(seed, a, c, m, count)
        return jsonify({
            "parameters": {"seed": seed, "a": a, "c": c, "m": m, "count": count},
            "sequence": generated_numbers
        })
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.error(f"Error in LCG generation: {e}")
        return jsonify({"error": "An unexpected error occurred. " + str(e)}), 500

@app.route('/api/bbs', methods=['POST'])
def generate_bbs():
    data = request.get_json()
    try:
        p = int(data.get('p'))
        q = int(data.get('q'))
        seed = int(data.get('seed'))
        count = int(data.get('count', 100)) # Default to 100 bits

        if None in [p, q, seed]:
            return jsonify({"error": "Missing one or more parameters: p, q, seed"}), 400

        generated_bits = bbs(p, q, seed, count)
        return jsonify({
            "parameters": {"p": p, "q": q, "seed": seed, "n": p*q, "count": count},
            "sequence_bits": generated_bits
        })
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.error(f"Error in BBS generation: {e}")
        return jsonify({"error": "An unexpected error occurred. " + str(e)}), 500

LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"

@app.route('/api/ai/explain', methods=['POST'])
def ai_explain():
    data = request.get_json()
    user_query = data.get('query')
    prng_type = data.get('prng_type', 'general')
    prng_params = data.get('params', {})
    prng_output = data.get('output', [])
    should_stream = data.get('stream', False) # Check for the stream flag

    if not user_query:
        return jsonify({"error": "Missing query parameter"}), 400

    # Construct a more detailed prompt for the LLM
    prompt_parts = [
        f"The user is asking about a {prng_type} Pseudo-Random Number Generator.",
    ]
    if prng_params:
        prompt_parts.append(f"The parameters used were: {prng_params}.")
    if prng_output:
        output_str = ", ".join(map(str, prng_output[:10])) # Show first 10 numbers/bits
        if len(prng_output) > 10:
            output_str += "..."
        prompt_parts.append(f"The generated sequence (first 10 elements) was: [{output_str}].")

    prompt_parts.append(f"User's question: {user_query}")
    detailed_prompt = " ".join(prompt_parts)

    payload = {
        "model": "google/gemma-3-4b", # Or your specific model name if configured in LM Studio
        "messages": [
            {"role": "system", "content": "You are an AI assistant specialized in explaining discrete mathematics concepts, particularly PRNGs like LCG and BBS, in an educational context. Keep explanations clear, concise, and suitable for a student learning these topics. Focus on the mathematical principles involved."},
            {"role": "user", "content": detailed_prompt}
        ],
        "temperature": 0.7,
    }

    if should_stream:
        payload["stream"] = True # Add stream parameter for LM Studio API

        def generate_stream():
            try:
                response_iter = requests.post(LM_STUDIO_API_URL, json=payload, stream=True)
                response_iter.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
                
                for line in response_iter.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith('data: '):
                            json_data_str = decoded_line[len('data: '):].strip()
                            if json_data_str == '[DONE]':
                                app.logger.info("Stream finished with [DONE]")
                                break
                            if not json_data_str: # Skip empty data lines if any
                                continue
                            try:
                                chunk_data = json.loads(json_data_str)
                                if chunk_data.get("choices") and len(chunk_data["choices"]) > 0:
                                    delta = chunk_data["choices"][0].get("delta", {})
                                    content_chunk = delta.get("content")
                                    if content_chunk:
                                        yield content_chunk
                            except json.JSONDecodeError:
                                app.logger.error(f"Error decoding JSON from stream: {json_data_str}")
                                # Optionally, yield an error message or skip
                                continue 
            except requests.exceptions.RequestException as e:
                app.logger.error(f"Streaming Error - RequestException: {e}")
                yield f"Error: Could not connect to AI service. {str(e)}"
            except Exception as e:
                app.logger.error(f"Streaming Error - General Exception: {e}")
                yield f"Error: An unexpected error occurred during streaming. {str(e)}"

        return Response(generate_stream(), mimetype='text/plain')

    else: # Non-streaming case (existing logic)
        try:
            response = requests.post(LM_STUDIO_API_URL, json=payload)
            response.raise_for_status()
            ai_response = response.json()
            
            if ai_response.get("choices") and len(ai_response["choices"]) > 0:
                explanation = ai_response["choices"][0].get("message", {}).get("content", "")
                return jsonify({"explanation": explanation})
            else:
                app.logger.error(f"Unexpected AI response structure: {ai_response}")
                return jsonify({"error": "Failed to get a valid explanation from AI. Unexpected response structure."}), 500

        except requests.exceptions.RequestException as e:
            app.logger.error(f"Error connecting to LM Studio: {e}")
            return jsonify({"error": f"Failed to connect to AI service: {str(e)}"}), 500
        except Exception as e:
            app.logger.error(f"Error processing AI explanation: {e}")
            return jsonify({"error": "An unexpected error occurred while getting AI explanation."}), 500


# --- Statistical Tests ---
def chi_squared_test(sequence, num_bins=10):
    """Performs a Chi-squared goodness-of-fit test for uniformity."""
    if not sequence or len(sequence) < num_bins:
        return {"error": "Insufficient data for Chi-squared test."}

    if isinstance(sequence[0], int): # LCG-like output (numbers)
        min_val = min(sequence)
        max_val = max(sequence)
        if max_val == min_val: # All numbers are the same
             # Avoid division by zero if range is 0. 
             # This sequence is not uniform, chi-squared is not appropriate or will be infinite.
            return {
                "test_type": "Chi-squared Goodness of Fit",
                "chi2_statistic": float('inf'),
                "p_value": 0.0,
                "degrees_freedom": num_bins - 1,
                "bins": list(range(min_val, max_val + 1) if max_val - min_val < num_bins else num_bins),
                "observed_freq": [len(sequence) if i == sequence[0] else 0 for i in range(min_val, max_val + 1) if max_val - min_val < num_bins],
                "expected_freq": [len(sequence) / num_bins] * num_bins,
                "message": "Chi-squared test is not meaningful as all values in the sequence are identical."
            }

        # Determine bins for LCG (numeric data)
        bin_edges = np.linspace(min_val, max_val, num_bins + 1)
        observed_freq, _ = np.histogram(sequence, bins=bin_edges)
        # Adjust for the case where max_val is included in the last bin explicitly
        if sequence[-1] == max_val:
            observed_freq[-1] += np.sum(np.array(sequence) == max_val) - (1 if observed_freq[-1] > 0 and bin_edges[-1] == max_val else 0)
            #This is a simplified adjustment; robust binning might be needed for edge cases

    elif isinstance(sequence[0], (bool, np.bool_)) or all(s in [0,1] for s in sequence): # BBS-like output (bits)
        counts = Counter(sequence)
        observed_freq = np.array([counts.get(0, 0), counts.get(1, 0)])
        num_bins = 2 # For binary data (0s and 1s)
    else:
        return {"error": "Unsupported data type for Chi-squared test."}

    total_observations = len(sequence)
    expected_freq = np.full(num_bins, total_observations / num_bins)

    # Filter out bins with zero expected frequency to avoid division by zero
    # Though for uniform distribution, this shouldn't happen unless total_observations is 0
    valid_bins = expected_freq > 0
    observed_freq_valid = observed_freq[valid_bins]
    expected_freq_valid = expected_freq[valid_bins]

    if len(observed_freq_valid) < 2: # Not enough categories for a meaningful test
        return {"error": "Not enough categories for a meaningful Chi-squared test after filtering."}

    chi2_stat, p_value = np.sum((observed_freq_valid - expected_freq_valid)**2 / expected_freq_valid), 0
    # Calculate p-value using scipy.stats.chi2
    degrees_freedom = len(observed_freq_valid) - 1
    if degrees_freedom > 0:
        p_value = chi2.sf(chi2_stat, degrees_freedom)
    else: # Should not happen with valid_bins check, but as a safeguard
        p_value = 1.0 if chi2_stat == 0 else 0.0

    return {
        "test_type": "Chi-squared Goodness of Fit",
        "chi2_statistic": round(chi2_stat, 4),
        "p_value": round(p_value, 4),
        "degrees_freedom": degrees_freedom,
        "bins": num_bins, # Or more descriptive bin labels if available
        "observed_freq": observed_freq.tolist(),
        "expected_freq": expected_freq.tolist(),
        "message": f"A p-value < 0.05 typically suggests the distribution is not uniform (reject H0). P-value: {p_value:.4f}"
    }

@app.route('/api/stats/test', methods=['POST'])
def perform_stat_test():
    data = request.get_json()
    sequence = data.get('sequence')
    test_type = data.get('test_type', 'chi_squared') # Default to chi_squared

    if not sequence:
        return jsonify({"error": "Missing sequence data"}), 400

    try:
        if test_type == 'chi_squared':
            # num_bins can be passed or defaulted
            num_bins = data.get('num_bins', 10 if sequence and isinstance(sequence[0], int) else 2)
            results = chi_squared_test(sequence, num_bins=num_bins)
        else:
            return jsonify({"error": f"Unsupported test type: {test_type}"}), 400
        
        if "error" in results:
             return jsonify({"error": results["error"]}), 400

        return jsonify(results)

    except Exception as e:
        app.logger.error(f"Error in statistical test: {e}")
        return jsonify({"error": "An unexpected error occurred during statistical testing. " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Running on a different port than Vite dev server
