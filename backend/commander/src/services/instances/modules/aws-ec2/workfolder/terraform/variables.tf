variable "region" {
  description = "Region to deploy the instance"
  type        = string
  default     = "eu-central-1"
}
variable "sg_rules" {
  description = "Comma-separated list of SG rules(<name>:<fromPort>:<toPort>:<protocol>:<cidr>)(ssh:22:22:tcp:0.0.0.0/0,http:80:80:tcp:0.0.0.0/0)"
  type        = string
}
variable "instance_name" {
  description = "Name of the instance"
  type        = string
  default     = "commander-instance"
}
variable "instance_type" {
  description = "Type of the instance"
  type        = string
  default     = "t2.micro"
}

variable "id" {
  description = "ID of the instance"
  type        = string
}

