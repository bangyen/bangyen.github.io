"""Generates ZSharp training data."""
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
            # TrainingConfig is a Pydantic model, needs dict unpacking
            from src.constants import TrainingConfig
            config_obj = TrainingConfig(**config)
            output = train(config_obj)
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
