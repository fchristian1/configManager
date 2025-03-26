#!/bin/bash

# Variablen definieren
KEYFILE="data/security/mongodb.key"
INIT_SCRIPT="data/init/mongo-init.js"
MONGO_HOST="backend_mongo:27017"
COMPOSE_CMD="docker compose up -d --build --remove-orphans"

# Sicherstellen, dass die Ordner existieren
mkdir -p $(dirname "$KEYFILE")
mkdir -p $(dirname "$INIT_SCRIPT")
mkdir -p data/mongo

# Prüfen ob Keyfile existiert, falls nicht erstellen
if [ ! -f "$KEYFILE" ]; then
    openssl rand -base64 756 >"$KEYFILE"
    chmod 400 "$KEYFILE"
    sudo chown 999:999 "$KEYFILE"
    echo "Keyfile erstellt."
else
    echo "Keyfile existiert bereits."
fi

# Prüfen ob mongo-init.js existiert, falls nicht erstellen
if [ ! -f "$INIT_SCRIPT" ]; then
    cat <<EOF >"$INIT_SCRIPT"
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "$MONGO_HOST" }]
});
EOF
    echo "$INIT_SCRIPT erstellt."
else
    echo "$INIT_SCRIPT existiert bereits."
fi

# Funktion zur rekursiven npm Installation
function install {
    for d in $(find . -type d -name node_modules -prune -o -type f -name package.json -print); do
        echo "Installing in $d"
        (cd $(dirname $d) && npm install)
    done
}

install .

# Container starten
$COMPOSE_CMD

# Erfolgsmeldung
echo "MongoDB ReplicaSet und Mongo Express sind gestartet."
echo "Mongo Express URL: http://localhost:8081 (admin/admin)"
echo "Backend URL: http://localhost:3000"
echo "Frontend URL: http://localhost:8080"
