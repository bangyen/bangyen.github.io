"""Generates ZSharp training data."""
import json
import os
import sys
import time
import traceback
import gzip
from pathlib import Path

import yaml
import time
import traceback
from pathlib import Path

# Add project root to path
sys.path.insert(0, os.getcwd())

from src.train import train


def run():
    print("Running ZSharp Data Generation...")

    # Define tasks
    # We use 'quick' configs for the script to be fast, but ideally 'baseline' for real data.
    # User can toggle this reference in the main update script args if they want full training.
    # For now, we default to quick to ensure it works.

    tasks = [
        ("configs/sgd_quick.yaml", "SGD Baseline"),
        ("configs/zsharp_quick.yaml", "ZSharp"),
    ]

    # Check if baseline configs exist and use them if possible?
    # Actually, let's use quick for the demo script stability.
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

            # Extract full trace
            # output typically contains: train_accuracies, test_accuracies, train_losses, test_losses
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

        except Exception as e:
            print(f"Error running {name}: {e}")
            import traceback

            traceback.print_exc()

    # Save to json
    # Save to Gzipped JSON in public directory
    output_path = Path("public/zsharp_data.json.gz")
    os.makedirs("public", exist_ok=True)
    
    with gzip.open(output_path, "wt", encoding="UTF-8") as f:
        json.dump(results_data, f)

    print(f"ZSharp generation complete. Saved to {output_path}")


if __name__ == "__main__":
    run()
