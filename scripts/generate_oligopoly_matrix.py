
import json
import sys
import os
from pathlib import Path

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
    current_run = 0
    
    print(f"Starting generation of {total_runs} simulations...")
    
    for n_firms in firms_options:
        for elasticity in elasticity_options:
            for base_price in base_price_options:
                current_run += 1
                print(f"[{current_run}/{total_runs}] Simulating: {n_firms} firms, b={elasticity}, a={base_price}")
                
                # Configure Firms
                # costs: spread them out slightly to be realistic? 
                # Or identical? Frontend fallback uses:
                # But typically Cournot with identical costs is standard baseline.
                # Let's use identical costs of 10.0 to keep it clean, 
                # or slight variance like [10, 10, 10]
                firms_config = [{"cost": 10.0} for _ in range(n_firms)]
                
                # Config
                config = {
                    "params": {
                        "a": float(base_price),
                        "b": float(elasticity)
                    },
                    "firms": firms_config,
                    "seed": 42, # Deterministic
                    "events": []
                }
                
                try:
                    # Run 15 rounds
                    run_id = run_game("cournot", 15, config, db)
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
                        item = {
                            "round": round_idx + 1, # 1-based for frontend
                            "price": r_data["price"],
                            "hhi": hhi,
                            "collusion": False,
                            "num_firms": n_firms,
                            "model_type": "cournot",
                            "demand_elasticity": elasticity,
                            "base_price": base_price,
                            "collusion_enabled": False
                        }
                        results_matrix.append(item)
                        
                except Exception as e:
                    print(f"Error generating run: {e}")
                    
    # Output to JSON
    with open("oligopoly_matrix.json", "w") as f:
        json.dump(results_matrix, f)
        
    print("Matrix generation complete. Saved to oligopoly_matrix.json")

if __name__ == "__main__":
    generate_matrix()
