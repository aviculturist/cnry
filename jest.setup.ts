import '@testing-library/jest-dom';

// https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables
import { loadEnvConfig } from '@next/env';
export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};
