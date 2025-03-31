#!/bin/bash

if [ -d ".terraform" ]; then
    AWS_SHARED_CREDENTIALS_FILE="./cred" terraform destroy -auto-approve \
        -var id="$1" \
        -var instance_name="$2" \
        -var instance_type="$3" \
        -var region="$4" \
        -var instance_count="$5" \
        -var sg_rules="$6"
fi
