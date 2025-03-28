provider "aws" {
  region = var.region
}

module "key_pair" {
  source   = "./modules/aws_key_pair"
  key_path = "./${var.id}_my_key.pem"
  key_name = "${var.id}_my_aws_key"
}
module "sg" {
  source   = "./modules/aws_sg"
  sg_rules = split(",", var.sg_rules)
  id       = var.id
}

module "aws-instances" {
  source             = "./modules/aws_instance"
  instance_name      = "${var.id}_${var.instance_name}-${count.index}"
  instance_type      = var.instance_type
  count              = tonumber(var.instance_count)
  key_name           = module.key_pair.name
  security_group_ids = values(module.sg.sg_ids)
  providers = {
    aws = aws
  }
  depends_on = [module.key_pair, module.sg]
}

## create a inventory file for ansible in ./ansible_playbook/inventory
## with module.aws-instances.public_ip output
# like this:
# [web:vars]
# ansible_ssh_user=ubuntu
# ansible_ssh_private_key_file=./../my_key.pem
# [web]
# 3.127.203.17
# 18.194.53.161
# 35.156.175.87

data "external" "generate_inventory" {
  depends_on = [module.aws-instances]

  program = ["bash", "-c", <<EOT
    INVENTORY_FILE="./ansible_playbooks/inventory"
    echo "[web:vars]" > $INVENTORY_FILE
    echo "ansible_ssh_user=ubuntu" >> $INVENTORY_FILE
    echo "ansible_ssh_private_key_file=./../${var.id}_my_key.pem" >> $INVENTORY_FILE
    echo "" >> $INVENTORY_FILE
    echo "[web]" >> $INVENTORY_FILE

    for ip in ${join(" ", module.aws-instances[*].public_ip)}; do
      echo "$ip" >> $INVENTORY_FILE
    done

    echo "{\"status\": \"success\"}"
  EOT
  ]
}
data "external" "ips_file" {
  depends_on = [module.aws-instances]

  program = ["bash", "-c", <<EOT
    INVENTORY_FILE="./ips"
    echo -n > $INVENTORY_FILE
    for ip in ${join(" ", module.aws-instances[*].public_ip)}; do
      echo "$ip" >> $INVENTORY_FILE
    done

    echo "{\"status\": \"success\"}"
  EOT
  ]
}
