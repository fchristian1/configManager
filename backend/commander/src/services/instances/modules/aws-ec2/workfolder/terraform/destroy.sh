#!/bin/bash

if [ -d ".terraform" ]; then
    AWS_SHARED_CREDENTIALS_FILE="./cred" terraform destroy -auto-approve \
        -var id="$1" \
        -var instance_name="$2" \
        -var instance_type="$3" \
        -var region="$4" \
        -var "sg_rules=ssh:22:22:tcp:0.0.0.0/0,http:8080:8080:tcp:0.0.0.0/0"
fi
