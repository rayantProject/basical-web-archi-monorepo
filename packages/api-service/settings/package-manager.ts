import { existsSync } from 'fs';
import { resolve, dirname } from 'path';

/**
 * Detect the package manager based on lock files present in the project
 * Searches from the current directory up to the root directory
 * @returns The detected package manager name ('yarn', 'pnpm', 'bun', or 'npm')
 */
export const detectPackageManager = (): string => {
  let currentDir = process.cwd();
  const root = '/';

  while (currentDir !== root) {
    if (existsSync(resolve(currentDir, 'yarn.lock'))) return 'yarn';
    if (existsSync(resolve(currentDir, 'pnpm-lock.yaml'))) return 'pnpm';
    if (existsSync(resolve(currentDir, 'bun.lockb'))) return 'bun';
    if (existsSync(resolve(currentDir, 'package-lock.json'))) return 'npm';

    // Move to parent directory
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) break; // Reached the root
    currentDir = parentDir;
  }

  return 'npm';
};

/**
 * Get the package manager instance
 */
export const packageManager = detectPackageManager();
