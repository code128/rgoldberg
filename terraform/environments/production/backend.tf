terraform {
  backend "gcs" {
    bucket = "striking-coil-320623-tfstate"
    prefix = "env/production"
  }
}