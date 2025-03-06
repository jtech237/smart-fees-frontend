#!usr/bin/env python3
import json
import os

# Path to Extension file
extensions_file = os.path.join(".devcontainer", "extensions.json")

# Path
devcontainer_file = os.path.join('.devcontainer', 'devcontainer.json')

# Template

devcontainer_template = {
    "name": "Smart-fees Frontend Container",
    "dockerComposeFile": [
        "../docker-compose.yml",
        "../docker-compose.override.yml"
    ],
    "service": "web",
    "workspaceFolder": "/app",
    "customizations": {
        "vscode": {
          "settings": {
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "editor.formatOnSave": True
          },
            "extensions": []
        }
    }
}

try:
    with open(extensions_file, 'r') as f:
        extensions_data = json.load(f)
except Exception as e:
    print(f"Erreur lors de la lecture de {extensions_file}: {e}")
    exit(1)

# Active extensions
active_extensions = [item["id"] for item in extensions_data if not item.get("id").startswith("vscode.")]

# Mettre à jour le template avec la liste d'extensions
devcontainer_template["customizations"]["vscode"]["extensions"] = active_extensions

# Écrire le fichier devcontainer.json final
try:
    with open(devcontainer_file, 'w') as f:
        json.dump(devcontainer_template, f, indent=4)
    print(f"Fichier '{devcontainer_file}' généré avec {len(active_extensions)} extensions actives.")
except Exception as e:
    print(f"Erreur lors de l'écriture de {devcontainer_file}: {e}")
    exit(1)
