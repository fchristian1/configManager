#!/bin/bash

terraform init -upgrade && terraform apply -var id="$1" -var "sg_rules=ssh:22:22:tcp:0.0.0.0/0" -auto-approve
