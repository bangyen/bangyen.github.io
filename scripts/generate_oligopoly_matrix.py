"""Generates oligopoly simulation data."""
import json
import multiprocessing
import os
import shutil
import uuid
import gzip
from pathlib import Path
import sys

# Add the project root to the Python path
sys.path.insert(0, os.getcwd())

from scripts.utils import create_experiment_database
from src.sim.runners.runner import run_game, get_run_results
from src.sim.models.metrics import calculate_hhi, calculate_market_shares_cournot


def calculate_hhi_for_round(firm_quantities):
    market_shares = calculate_market_shares_cournot(firm_quantities)
    return calculate_hhi(market_shares)


def generate_matrix():
    # Matrix Validation
    # Firms: 2, 3, 4, 5
    # Elasticity (b): 1.5, 2.0, 2.5
    # Base Price (a): 30, 40, 50

    firms_options = [2, 3, 4, 5]
    elasticity_options = [1.5, 2.0, 2.5]
    base_price_options = [30, 40, 50]

    db_path = "data/matrix.db"
    os.makedirs("data", exist_ok=True)
    if os.path.exists(db_path):
        os.remove(db_path)

    db = create_experiment_database(db_path)

    results_matrix = []

    total_runs = len(firms_options) * len(elasticity_options) * len(base_price_options)

    # Generate all configs first
    configs = []

    print(f"Generating simulation configurations...")

    model_options = ["cournot", "bertrand"]
    collusion_options = [True, False]

    run_counter = 0
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
                            "seed": 42,  # Deterministic (per run)
                            "events": [],
                        }

                        configs.append(
                            {
                                "run_id": run_counter,
                                "n_firms": n_firms,
                                "elasticity": elasticity,
                                "base_price": base_price,
                                "model_type": model_type,
                                "collusion_enabled": collusion_enabled,
                                "config": config,
                            }
                        )

    print(f"Total simulations to run: {len(configs)}")

    # Run in parallel
    # Use 75% of CPUs
    num_workers = max(1, int(multiprocessing.cpu_count() * 0.75))
    print(f"Using {num_workers} workers...")

    with multiprocessing.Pool(num_workers) as pool:
        # Chunk the configs for better batching? No, one by one is fine for pool.map
        # Check if map works with exception handling inside worker
        results_lists = pool.map(run_simulation_batch, configs)

    # Flatten results
    for res in results_lists:
        results_matrix.extend(res)

    # Output to JSON
    # Output to JSON
    with open("oligopoly_matrix.json", "w") as f:
        json.dump(results_matrix, f)

    print("Matrix generation complete. Saved to oligopoly_matrix.json")


def run_simulation_batch(item):
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

                # Calculate HHI for this round
                current_quantities = []
                for f_data in firms_data:
                    if round_idx < len(f_data["quantities"]):
                        current_quantities.append(f_data["quantities"][round_idx])
                    else:
                        current_quantities.append(0)

                hhi = calculate_hhi_for_round(current_quantities)

                # Create MatrixItem
                res_item = {
                    "round": round_idx + 1,
                    "price": r_data["price"],
                    "hhi": hhi,
                    "collusion": collusion_enabled,
                    "num_firms": n_firms,
                    "model_type": model_type,
                    "demand_elasticity": elasticity,
                    "base_price": base_price,
                    "collusion_enabled": collusion_enabled,
                }
                results.append(res_item)

        except Exception as e:
            print(f"Error generating run {item['run_id']}: {e}")

        return results

    finally:
        # Clean up temp db
        if "db" in locals():
            # db.close() ? SQLAlchemy engine usually.
            # Assuming create_experiment_database creates tables.
            pass
        # Try to remove file
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except:
                pass


if __name__ == "__main__":
    generate_matrix()
