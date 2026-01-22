
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import zlib from 'zlib';

const TEMP_DIR = path.resolve(process.cwd(), 'temp_research_repos');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const VENV_DIR = path.join(TEMP_DIR, 'venv');
const IS_WIN = process.platform === 'win32';

const REPOS = {
    zsharp: 'https://github.com/bangyen/zsharp.git',
    oligopoly: 'https://github.com/bangyen/oligopoly.git',
};

// Embedded Python Scripts
const GENERATE_ZSHARP_PY = `"""Generates ZSharp training data."""
import json
import os
import sys
import yaml  # pylint: disable=import-error

# Add project root to path
sys.path.insert(0, os.getcwd())

# pylint: disable=wrong-import-position, import-error
from src.train import train
# pylint: enable=wrong-import-position, import-error


def run():
    """Main execution function."""
    print("Running ZSharp Data Generation...")

    tasks = [
        ("configs/sgd_quick.yaml", "SGD Baseline"),
        ("configs/zsharp_quick.yaml", "ZSharp"),
    ]

    if os.path.exists("configs/sgd_baseline.yaml"):
        print("Found baseline configs, using full training (this may take time)...")
        tasks = [
            ("configs/sgd_baseline.yaml", "SGD Baseline"),
            ("configs/zsharp_baseline.yaml", "ZSharp"),
        ]
    else:
        print("Using quick configs...")

    results_data = {}

    for config_path, name in tasks:
        print(f"Running {name} from {config_path}...")

        with open(config_path, encoding="utf-8") as f:
            config = yaml.safe_load(f)

        # Ensure we capture output
        try:
            output = train(config)
            if not output:
                print(f"Failed to run {name}")
                continue

            results_data[name] = {
                "train_accuracies": output.get("train_accuracies", []),
                "train_losses": output.get("train_losses", []),
                "test_accuracies": output.get("test_accuracies", []),
                "test_losses": output.get("test_losses", []),
                "final_test_accuracy": (
                    output.get("test_accuracies", [])[-1]
                    if output.get("test_accuracies")
                    else 0
                ),
                "final_test_loss": (
                    output.get("test_losses", [])[-1]
                    if output.get("test_losses")
                    else 0
                ),
            }
            print(
                f"Completed {name}: Final Acc {output.get('final_test_accuracy', 0):.2f}%"
            )

        except Exception as e:  # pylint: disable=broad-exception-caught
            print(f"Error running {name}: {e}")

    with open("zsharp_data.json", "w", encoding="utf-8") as f:
        json.dump(results_data, f)

    print("ZSharp generation complete. Saved to zsharp_data.json")


if __name__ == "__main__":
    run()
`;

const GENERATE_OLIGOPOLY_PY = `"""Generates oligopoly simulation data."""
import json
import multiprocessing
import os
import uuid
import sys

# Add the project root to the Python path
sys.path.insert(0, os.getcwd())

# pylint: disable=wrong-import-position, import-error
from scripts.utils import create_experiment_database
from src.sim.runners.runner import run_game, get_run_results
from src.sim.models.metrics import calculate_hhi, calculate_market_shares_cournot
# pylint: enable=wrong-import-position, import-error


def calculate_hhi_for_round(firm_quantities):
    """Calculates HHI for a given round based on firm quantities."""
    market_shares = calculate_market_shares_cournot(firm_quantities)
    return calculate_hhi(market_shares)


def generate_configs():
    """Generates all simulation configurations."""
    configs = []
    run_counter = 0
    firms_options = [2, 3, 4, 5]
    elasticity_options = [1.5, 2.0, 2.5]
    base_price_options = [30, 40, 50]
    model_options = ["cournot", "bertrand"]
    collusion_options = [True, False]

    for n_firms in firms_options:
        for elasticity in elasticity_options:
            for base_price in base_price_options:
                for model_type in model_options:
                    for collusion_enabled in collusion_options:
                        run_counter += 1
                        firms_config = [{"cost": 10.0} for _ in range(n_firms)]

                        config = {
                            "params": {"a": float(base_price), "b": float(elasticity)},
                            "firms": firms_config,
                            "seed": 42,
                            "events": [],
                        }

                        configs.append({
                            "run_id": run_counter,
                            "n_firms": n_firms,
                            "elasticity": elasticity,
                            "base_price": base_price,
                            "model_type": model_type,
                            "collusion_enabled": collusion_enabled,
                            "config": config,
                        })
    return configs


def generate_matrix():
    """Generates the oligopoly simulation matrix."""
    # Setup Database
    db_path = "data/matrix.db"
    os.makedirs("data", exist_ok=True)
    if os.path.exists(db_path):
        os.remove(db_path)
    # create_experiment_database might need arguments? assuming no based on orig script
    create_experiment_database(db_path)

    # Generate Configs
    print("Generating simulation configurations...")
    configs = generate_configs()
    print(f"Total simulations to run: {len(configs)}")

    results_matrix = []

    # Run in parallel
    # Use 75% of CPUs
    num_workers = max(1, int(multiprocessing.cpu_count() * 0.75))
    print(f"Using {num_workers} workers...")

    with multiprocessing.Pool(num_workers) as pool:
        results_lists = pool.map(run_simulation_batch, configs)

    # Flatten results
    for res in results_lists:
        results_matrix.extend(res)

    # Output to JSON
    with open("oligopoly_matrix.json", "w", encoding="utf-8") as f:
        json.dump(results_matrix, f)

    print("Matrix generation complete. Saved to oligopoly_matrix.json")


def run_simulation_batch(item):
    """Runs a batch of simulations for a given configuration."""
    # pylint: disable=too-many-locals
    # item is a dict with config details
    # We create a unique temporary DB for this run to avoid locking
    temp_id = str(uuid.uuid4())
    db_path = f"data/temp_{temp_id}.db"

    # Ensure data dir exists (racing? main process created it)
    try:
        db = create_experiment_database(db_path)

        results = []
        n_firms = item["n_firms"]
        elasticity = item["elasticity"]
        base_price = item["base_price"]
        model_type = item["model_type"]
        collusion_enabled = item["collusion_enabled"]
        config = item["config"]

        try:
            # Run 15 rounds
            run_id = run_game(model_type, 15, config, db)
            run_results = get_run_results(run_id, db)

            rounds_data = run_results["rounds_data"]
            firms_data = run_results["firms_data"]

            for r_data in rounds_data:
                round_idx = r_data["round"]
                current_quantities = []
                for f_data in firms_data:
                    # pylint: disable=unnecessary-list-index-lookup
                    qty = (
                        f_data["quantities"][round_idx]
                        if round_idx < len(f_data["quantities"])
                        else 0
                    )
                    current_quantities.append(qty)

                hhi = calculate_hhi_for_round(current_quantities)

                results.append({
                    "round": round_idx + 1,
                    "price": r_data["price"],
                    "hhi": hhi,
                    "collusion": collusion_enabled,
                    "num_firms": n_firms,
                    "model_type": model_type,
                    "demand_elasticity": elasticity,
                    "base_price": base_price,
                    "collusion_enabled": collusion_enabled,
                })

        except Exception as e:  # pylint: disable=broad-exception-caught
            print(f"Error generating run {item['run_id']}: {e}")

        return results

    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except OSError:
                pass


if __name__ == "__main__":
    generate_matrix()
`;

// Helper functions
function runCmd(cmd: string, cwd: string = process.cwd(), env: NodeJS.ProcessEnv = process.env) {
    console.log(`Running: ${cmd} in ${cwd}`);
    execSync(cmd, { cwd, env, stdio: 'inherit' });
}

function setupVenv(): { pipCmd: string; pythonCmd: string } {
    if (!fs.existsSync(VENV_DIR)) {
        console.log('Creating virtual environment...');
        execSync(`python3 -m venv ${VENV_DIR}`, { stdio: 'inherit' });
    } else {
        console.log('Using existing virtual environment...');
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
    fs.writeFileSync(scriptPath, GENERATE_ZSHARP_PY);
    console.log('Running ZSharp Generation...');
    const env = { ...process.env, PYTHONPATH: cwd };
    runCmd(`${pythonCmd} generate_data.py`, cwd, env);
}

function runOligopoly(pythonCmd: string) {
    const cwd = path.join(TEMP_DIR, 'oligopoly');
    const scriptPath = path.join(cwd, 'generate_matrix.py');
    fs.writeFileSync(scriptPath, GENERATE_OLIGOPOLY_PY);
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
