
 
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const TEMP_DIR = path.resolve(process.cwd(), 'temp_research_repos');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const VENV_DIR = path.join(TEMP_DIR, 'venv');
const IS_WIN = process.platform === 'win32';

const REPOS = {
    zsharp: 'https://github.com/bangyen/zsharp.git',
    oligopoly: 'https://github.com/bangyen/oligopoly.git',
};



// Helper functions
function runCmd(cmd: string, cwd: string = process.cwd(), env: NodeJS.ProcessEnv = process.env) {
    console.log(`Running: ${cmd} in ${cwd}`);
    execSync(cmd, { cwd, env, stdio: 'inherit' });
}

function setupVenv(): { pipCmd: string; pythonCmd: string } {
    if (fs.existsSync(VENV_DIR)) {
        console.log('Using existing virtual environment...');
    } else {
        console.log('Creating virtual environment...');
        execSync(`python3 -m venv ${VENV_DIR}`, { stdio: 'inherit' });
    }

    const binDir = IS_WIN ? 'Scripts' : 'bin';
    const pipCmd = path.join(VENV_DIR, binDir, 'pip');
    const pythonCmd = path.join(VENV_DIR, binDir, 'python');
    return { pipCmd, pythonCmd };
}

function updateRepos() {
    for (const [name, url] of Object.entries(REPOS)) {
        const repoDir = path.join(TEMP_DIR, name);
        if (fs.existsSync(repoDir)) {
            console.log(`Updating ${name}...`);
            runCmd('git fetch origin && git reset --hard origin/main', repoDir);
        } else {
            console.log(`Cloning ${name}...`);
            runCmd(`git clone ${url} ${name}`, TEMP_DIR);
        }
    }
}

function installDeps(pipCmd: string) {
    // Install repo deps
    for (const name of Object.keys(REPOS)) {
        const repoDir = path.join(TEMP_DIR, name);
        console.log(`Installing ${name} dependencies...`);
        runCmd(`${pipCmd} install .`, repoDir);
    }
    // Install common deps
    // console.log("Installing common dependencies (requests)...");
    // runCmd(`${pipCmd} install requests`, TEMP_DIR);
}

function runZSharp(pythonCmd: string) {
    const cwd = path.join(TEMP_DIR, 'zsharp');
    const scriptPath = path.join(cwd, 'generate_data.py');
    const sourcePath = path.join(process.cwd(), 'scripts/python/generate_zsharp_data.py');

    fs.copyFileSync(sourcePath, scriptPath);

    console.log('Running ZSharp Generation...');
    const env = { ...process.env, PYTHONPATH: cwd };
    runCmd(`${pythonCmd} generate_data.py`, cwd, env);
}

function runOligopoly(pythonCmd: string) {
    const cwd = path.join(TEMP_DIR, 'oligopoly');
    const scriptPath = path.join(cwd, 'generate_matrix.py');
    const sourcePath = path.join(process.cwd(), 'scripts/python/generate_oligopoly_matrix.py');

    fs.copyFileSync(sourcePath, scriptPath);

    console.log('Running Oligopoly Generation...');
    const env = { ...process.env, PYTHONPATH: cwd };
    runCmd(`${pythonCmd} generate_matrix.py`, cwd, env);
}

function compressAndMove() {
    // ZSharp
    const zSrc = path.join(TEMP_DIR, 'zsharp', 'zsharp_data.json');
    const zDst = path.join(PUBLIC_DIR, 'zsharp_data.json.gz');
    if (fs.existsSync(zSrc)) {
        console.log(`Compressing ${zSrc} -> ${zDst}`);
        const content = fs.readFileSync(zSrc);
        const compressed = zlib.gzipSync(content);
        fs.writeFileSync(zDst, compressed);
    } else {
        console.warn(`Warning: ${zSrc} not found.`);
    }

    // Oligopoly
    const oSrc = path.join(TEMP_DIR, 'oligopoly', 'oligopoly_matrix.json');
    const oDst = path.join(PUBLIC_DIR, 'oligopoly_data.json.gz');
    if (fs.existsSync(oSrc)) {
        console.log(`Compressing ${oSrc} -> ${oDst}`);
        const content = fs.readFileSync(oSrc);
        const compressed = zlib.gzipSync(content);
        fs.writeFileSync(oDst, compressed);
    } else {
        console.warn(`Warning: ${oSrc} not found.`);
    }
}

// Main
function main() {
    const args = process.argv.slice(2);
    const clean = args.includes('--clean');

    if (clean && fs.existsSync(TEMP_DIR)) {
        console.log(`Cleaning ${TEMP_DIR}...`);
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const { pipCmd, pythonCmd } = setupVenv();

    updateRepos();
    installDeps(pipCmd);

    runZSharp(pythonCmd);
    runOligopoly(pythonCmd);

    compressAndMove();

    if (clean) {
        console.log(`Cleaning up ${TEMP_DIR}...`);
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    } else {
        console.log(`Keeping ${TEMP_DIR}. Use --clean to remove.`);
    }
    console.log('Done!');
}

main();
