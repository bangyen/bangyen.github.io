
import os
import shutil
import subprocess
import gzip
import sys
from pathlib import Path

# Constants
TEMP_DIR = os.path.abspath("temp_research_repos")
PUBLIC_DIR = os.path.abspath("public")
SCRIPTS_DIR = os.path.abspath("scripts")
VENV_DIR = os.path.join(TEMP_DIR, "venv")

REPOS = {
    "zsharp": "https://github.com/bangyen/zsharp.git",
    "oligopoly": "https://github.com/bangyen/oligopoly.git"
}

def run_cmd(cmd, cwd=None, env=None):
    print(f"Running: {' '.join(cmd) if isinstance(cmd, list) else cmd} in {cwd or os.getcwd()}")
    subprocess.check_call(cmd, shell=isinstance(cmd, str), cwd=cwd, env=env)

def main():
    # 1. Clean and Setup Temp Dir
    if os.path.exists(TEMP_DIR):
        print(f"Cleaning existing {TEMP_DIR}...")
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR)
    
    # 2. Create Virtual Environment
    print("Creating virtual environment...")
    subprocess.check_call([sys.executable, "-m", "venv", VENV_DIR])
    
    # Determine paths for venv binaries
    if sys.platform == "win32":
        pip_cmd = os.path.join(VENV_DIR, "Scripts", "pip")
        python_cmd = os.path.join(VENV_DIR, "Scripts", "python")
    else:
        pip_cmd = os.path.join(VENV_DIR, "bin", "pip")
        python_cmd = os.path.join(VENV_DIR, "bin", "python")

    # Upgrade pip
    run_cmd([python_cmd, "-m", "pip", "install", "--upgrade", "pip"])

    # 3. Clone Repos
    for name, url in REPOS.items():
        print(f"Cloning {name}...")
        run_cmd(f"git clone {url} {name}", cwd=TEMP_DIR)
        
    # 4. Install Repos into Venv
    # This automatically installs all dependencies defined in their pyproject.toml
    print("Installing ZSharp dependencies...")
    run_cmd([pip_cmd, "install", "."], cwd=os.path.join(TEMP_DIR, "zsharp"))
    
    print("Installing Oligopoly dependencies...")
    run_cmd([pip_cmd, "install", "."], cwd=os.path.join(TEMP_DIR, "oligopoly"))

    # 5. Copy Helper Scripts
    shutil.copy(
        os.path.join(SCRIPTS_DIR, "generate_zsharp_data.py"),
        os.path.join(TEMP_DIR, "zsharp", "generate_data.py")
    )
    shutil.copy(
        os.path.join(SCRIPTS_DIR, "generate_oligopoly_matrix.py"),
        os.path.join(TEMP_DIR, "oligopoly", "generate_matrix.py")
    )
    
    # 6. Run ZSharp Generation
    print("Generating ZSharp Data...")
    zsharp_cwd = os.path.join(TEMP_DIR, "zsharp")
    env = os.environ.copy()
    env["PYTHONPATH"] = zsharp_cwd
    
    # Use venv python
    run_cmd([python_cmd, "generate_data.py"], cwd=zsharp_cwd, env=env)
    
    # 7. Run Oligopoly Generation
    print("Generating Oligopoly Data...")
    oligopoly_cwd = os.path.join(TEMP_DIR, "oligopoly")
    env = os.environ.copy()
    env["PYTHONPATH"] = oligopoly_cwd
    
    run_cmd([python_cmd, "generate_matrix.py"], cwd=oligopoly_cwd, env=env)
    
    # 8. Compress and Move
    output_files = [
        (os.path.join(zsharp_cwd, "zsharp_data.json"), os.path.join(PUBLIC_DIR, "zsharp_data.json.gz")),
        (os.path.join(oligopoly_cwd, "oligopoly_matrix.json"), os.path.join(PUBLIC_DIR, "oligopoly_data.json.gz"))
    ]
    
    for src, dst in output_files:
        if os.path.exists(src):
            print(f"Compressing {src} -> {dst}")
            with open(src, 'rb') as f_in:
                with gzip.open(dst, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
        else:
            print(f"Error: Output file {src} not found!")
            
    # 9. Cleanup
    print(f"Cleaning up {TEMP_DIR}...")
    shutil.rmtree(TEMP_DIR)
    print("Done! Research data updated in public/.")

if __name__ == "__main__":
    main()
