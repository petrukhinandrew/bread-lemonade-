terraform {
  required_providers {
    kind = {
      source = "tehcyx/kind"
      version = "0.8.0"
    }
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_file
}