// Helper function for GCD (Greatest Common Divisor)
export const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

// Basic primality test
export const isPrimeInteractive = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};
