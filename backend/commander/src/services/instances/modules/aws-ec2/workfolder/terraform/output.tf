output "public_ips" {
  value = module.aws-instances[*].public_ip
}
