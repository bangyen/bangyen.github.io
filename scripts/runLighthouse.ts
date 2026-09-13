import { spawn } from 'node:child_process';

import { chromium } from '@playwright/test';

const child = spawn('bunx', ['lhci', 'autorun'], {
    env: { ...process.env, CHROME_PATH: chromium.executablePath() },
    stdio: 'inherit',
});

child.on('exit', code => {
    process.exitCode = code ?? 1;
});
