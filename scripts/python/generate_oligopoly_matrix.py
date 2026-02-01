"""Generates oligopoly simulation data."""
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
