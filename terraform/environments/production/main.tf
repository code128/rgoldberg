locals {
  env = "production"
}

provider "google" {
  project = var.project
  region  = var.region
}

module "function" {
  source      = "../../modules/cloud-functions"
  project     = var.project
  name        = "production-app"
  entry_point = "random_letter"
}

output "function_url" {
  value = module.function.function_url
}


module "run" {
  source      = "../../modules/cloud-run"
}

module "workflow" {
  source      = "../../modules/workflows"
}


terraform {
  backend "gcs" {
    bucket = "striking-coil-320623-tfstate"
    prefix = "env/production"
  }
}