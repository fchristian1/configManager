#!/bin/bash
# Funktion recursive durch alle ordner und suche von package.json ausser node_modules
# und führt npm install aus

function install {
    for d in $(find . -type d -name node_modules -prune -o -type f -name package.json -print); do
        echo "Installing in $d"
        (cd $(dirname $d) && npm install)
    done
}

install .
docker compose up -d --build --remove-orphans
