// src/scripts/sequelize.ts
import { execSync } from 'child_process';

const command = process.argv[2];
execSync(`sequelize-cli ${command}`, { stdio: 'inherit' });