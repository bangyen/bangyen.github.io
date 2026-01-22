"""
Script to update research data by cloning repositories, generating data, and processing it.
"""
import os
import shutil
import subprocess
import gzip
import sys
import argparse

# Constants
TEMP_DIR = os.path.abspath("temp_research_repos")
PUBLIC_DIR = os.path.abspath("public")
SCRIPTS_DIR = os.path.abspath("scripts")
VENV_DIR = os.path.join(TEMP_DIR, "venv")

REPOS = {
    "zsharp": "https://github.com/bangyen/zsharp.git",
    "oligopoly": "https://github.com/bangyen/oligopoly.git",
}


def run_cmd(cmd, cwd=None, env=None):
    """Executes a shell command."""
    print(
        f"Running: {' '.join(cmd) if isinstance(cmd, list) else cmd} in {cwd or os.getcwd()}"
    )
    subprocess.check_call(cmd, shell=isinstance(cmd, str), cwd=cwd, env=env)


def setup_venv():
    """Creates and configures the virtual environment."""
    if not os.path.exists(VENV_DIR):
        print("Creating virtual environment...")
        subprocess.check_call([sys.executable, "-m", "venv", VENV_DIR])
    else:
        print("Using existing virtual environment...")

    if sys.platform == "win32":
        pip_cmd = os.path.join(VENV_DIR, "Scripts", "pip")
        python_cmd = os.path.join(VENV_DIR, "Scripts", "python")
    else:
        pip_cmd = os.path.join(VENV_DIR, "bin", "pip")
        python_cmd = os.path.join(VENV_DIR, "bin", "python")

    return pip_cmd, python_cmd


def update_repos(args):
    """Clones or updates repositories."""
    if not args.skip_research:
        for name, url in REPOS.items():
            if name == "zsharp" and args.skip_zsharp:
                continue
            if name == "oligopoly" and args.skip_oligopoly:
                continue
            repo_dir = os.path.join(TEMP_DIR, name)
            if os.path.exists(repo_dir):
                print(f"Updating {name}...")
                run_cmd("git fetch origin", cwd=repo_dir)
                run_cmd("git reset --hard origin/main", cwd=repo_dir)
            else:
                print(f"Cloning {name}...")
                run_cmd(f"git clone {url} {name}", cwd=TEMP_DIR)


def install_dependencies(args, pip_cmd):
    """Installs dependencies for repositories."""
    if not args.skip_research:
        if not args.skip_zsharp:
            print("Installing ZSharp dependencies...")
            run_cmd([pip_cmd, "install", "."], cwd=os.path.join(TEMP_DIR, "zsharp"))

        if not args.skip_oligopoly:
            print("Installing Oligopoly dependencies...")
            run_cmd([pip_cmd, "install", "."], cwd=os.path.join(TEMP_DIR, "oligopoly"))

    print("Installing common dependencies (requests)...")
    run_cmd([pip_cmd, "install", "requests"], cwd=TEMP_DIR)


def run_zsharp_generation(args, python_cmd):
    """Runs ZSharp data generation."""
    if not args.skip_research and not args.skip_zsharp:
        # Copy script
        shutil.copy(
            os.path.join(SCRIPTS_DIR, "generate_zsharp_data.py"),
            os.path.join(TEMP_DIR, "zsharp", "generate_data.py"),
        )
        print("Generating ZSharp Data...")
        zsharp_cwd = os.path.join(TEMP_DIR, "zsharp")
        env = os.environ.copy()
        env["PYTHONPATH"] = zsharp_cwd
        run_cmd([python_cmd, "generate_data.py"], cwd=zsharp_cwd, env=env)


def run_oligopoly_generation(args, python_cmd):
    """Runs Oligopoly data generation."""
    if not args.skip_research and not args.skip_oligopoly:
        # Copy Script
        shutil.copy(
            os.path.join(SCRIPTS_DIR, "generate_oligopoly_matrix.py"),
            os.path.join(TEMP_DIR, "oligopoly", "generate_matrix.py"),
        )
        print("Generating Oligopoly Data...")
        oligopoly_cwd = os.path.join(TEMP_DIR, "oligopoly")
        env = os.environ.copy()
        env["PYTHONPATH"] = oligopoly_cwd
        run_cmd([python_cmd, "generate_matrix.py"], cwd=oligopoly_cwd, env=env)


def compress_output(args):
    """Compresses and moves output files."""
    if args.skip_research:
        return

    output_files = []
    if not args.skip_zsharp:
        zsharp_cwd = os.path.join(TEMP_DIR, "zsharp")
        output_files.append((
            os.path.join(zsharp_cwd, "zsharp_data.json"),
            os.path.join(PUBLIC_DIR, "zsharp_data.json.gz"),
        ))
    if not args.skip_oligopoly:
        oligopoly_cwd = os.path.join(TEMP_DIR, "oligopoly")
        output_files.append((
            os.path.join(oligopoly_cwd, "oligopoly_matrix.json"),
            os.path.join(PUBLIC_DIR, "oligopoly_data.json.gz"),
        ))

    for src, dst in output_files:
        if os.path.exists(src):
            print(f"Compressing {src} -> {dst}")
            with open(src, "rb") as f_in:
                with gzip.open(dst, "wb") as f_out:
                    shutil.copyfileobj(f_in, f_out)
        else:
            print(f"Error: Output file {src} not found!")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Update research data.")
    parser.add_argument("--clean", action="store_true", help="Clean temp directory.")
    parser.add_argument("--quizzes", action="store_true", help="Scrape quiz data.")
    parser.add_argument("--skip-research", action="store_true", help="Skip research data.")
    parser.add_argument("--skip-zsharp", action="store_true", help="Skip ZSharp.")
    parser.add_argument("--skip-oligopoly", action="store_true", help="Skip Oligopoly.")
    args = parser.parse_args()

    # 1. Clean and Setup Temp Dir
    if args.clean and os.path.exists(TEMP_DIR):
        print(f"Cleaning existing {TEMP_DIR}...")
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR, exist_ok=True)

    # 2. Setup Venv
    pip_cmd, python_cmd = setup_venv()

    # 3. Clone/Update
    update_repos(args)

    # 4. Install Deps
    install_dependencies(args, pip_cmd)

    # 5. Run Generations
    run_zsharp_generation(args, python_cmd)
    run_oligopoly_generation(args, python_cmd)

    # 6. Run Quiz Scraper
    if args.quizzes:
        print("Scraping Quizzes...")
        env = os.environ.copy()
        scrape_script = os.path.join(SCRIPTS_DIR, "scrape_quizzes.py")
        run_cmd([python_cmd, scrape_script], cwd=SCRIPTS_DIR, env=env)

    # 7. Compress
    compress_output(args)

    # 8. Cleanup
    if args.clean:
        print(f"Cleaning up {TEMP_DIR}...")
        shutil.rmtree(TEMP_DIR)
    else:
        print(f"Keeping {TEMP_DIR} for caching. Use --clean to remove.")

    print("Done! Research data updated in public/.")


if __name__ == "__main__":
    main()
