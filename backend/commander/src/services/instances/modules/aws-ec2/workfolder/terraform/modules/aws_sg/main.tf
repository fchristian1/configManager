terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1" # ⇐ Anpassen, falls nötig
}

variable "sg_rules" {
  description = "List of SG rules in the format <name>:<fromPort>:<toPort>:<protocol>:<cidr>"
  type        = list(string)
  default = [
    "ssh:22:22:tcp:0.0.0.0/0",
    "http:80:80:tcp:0.0.0.0/0"
  ]
}
variable "id" {
  description = "ID of the instance"
  type        = string
}
locals {
  # Stabile eindeutige Schlüssel aus Hash + Name
  prefixed_rules = {
    for rule in var.sg_rules :
    "${var.id}-${split(":", rule)[0]}" => {
      from_port   = tonumber(split(":", rule)[1])
      to_port     = tonumber(split(":", rule)[2])
      protocol    = split(":", rule)[3]
      cidr_blocks = [split(":", rule)[4]]
    }
  }
}

resource "aws_security_group" "sg" {
  for_each    = local.prefixed_rules
  name        = each.key
  description = "Security Group for ${each.key}"

  ingress {
    from_port   = each.value.from_port
    to_port     = each.value.to_port
    protocol    = each.value.protocol
    cidr_blocks = each.value.cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "sg_ids" {
  value = { for k, sg in aws_security_group.sg : k => sg.id }
}
