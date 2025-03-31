#!/bin/bash
echo "Creating EC2 instance..."
echo "ID: $1"
echo "Instance Name: $2"
echo "Instance Type: $3"
echo "Region: $4"
echo "Instance Count: $5"
echo "Security Group Rules: $6"
echo "Creating EC2 instance with the above parameters..."
AWS_SHARED_CREDENTIALS_FILE="./cred" terraform init -upgrade && AWS_SHARED_CREDENTIALS_FILE="./cred" terraform apply -auto-approve \
    -var id="$1" \
    -var instance_name="$2" \
    -var instance_type="$3" \
    -var region="$4" \
    -var instance_count="$5" \
    -var sg_rules="$6"
