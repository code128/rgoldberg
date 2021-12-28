# [START workflows_api_enable]
resource "google_project_service" "workflows" {
  service            = "workflows.googleapis.com"
  disable_on_destroy = false
}
# [END workflows_api_enable]

# [START workflows_serviceaccount_create]
resource "google_service_account" "workflows_service_account" {
  account_id   = "workflows-sa"
  display_name = "Workflows Service Account"
}
# [END workflows_serviceaccount_create]

# [START workflows_workflow_deploy]
resource "google_workflows_workflow" "workflows" {
  name            = "random-service-chooser"
  description     = "Chooses from a set of random services"
  service_account = google_service_account.workflows_service_account.id
  source_contents = file("../../../workflow-random-chooser/random-service-choice.yaml")
  depends_on = [google_project_service.workflows]
}
# [END workflows_workflow_deploy]