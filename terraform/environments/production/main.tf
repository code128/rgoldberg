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

module "run" {
  source      = "../../modules/cloud-run"
}