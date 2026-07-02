export interface Credentials {
  username: string;
  password: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Did you create a .env file from .env.example?`
    );
  }
  return value;
}

/**
 * Central place to resolve test credentials. Values come from environment
 * variables (loaded via dotenv from a local, gitignored .env file) so no
 * secrets are hardcoded in the test source.
 */
export const users = {
  standard: (): Credentials => ({
    username: requireEnv("STANDARD_USER"),
    password: requireEnv("USER_PASSWORD"),
  }),
  lockedOut: (): Credentials => ({
    username: requireEnv("LOCKED_OUT_USER"),
    password: requireEnv("USER_PASSWORD"),
  }),
  problem: (): Credentials => ({
    username: requireEnv("PROBLEM_USER"),
    password: requireEnv("USER_PASSWORD"),
  }),
};

/** Non-secret product/test data used across specs. */
export const products = {
  backpack: "Sauce Labs Backpack",
  bikeLight: "Sauce Labs Bike Light",
  boltTShirt: "Sauce Labs Bolt T-Shirt",
} as const;

export const checkoutInfo = {
  firstName: "Andre",
  lastName: "Keren",
  postalCode: "1234",
} as const;
