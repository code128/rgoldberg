from flask import Flask, request
from google.cloud import tasks_v2
import json

app = Flask(__name__)

# Create a client.
client = tasks_v2.CloudTasksClient()

project = "proj2-310921"
queue = "my-queue"
location = "us-central1"
workflowName = "workflow-1"
url = (
    "https://workflowexecutions.googleapis.com/v1/projects/"
    + project
    + "/locations/us-central1/workflows/"
    + workflowName
    + "/executions"
)
service_account_email = "proj2-310921@appspot.gserviceaccount.com"
payload = "hello"


@app.route("/", methods=["GET"])
def hello():
    """ Return a friendly HTTP greeting. """
    who = request.args.get("who", "World")
    dispatchToCloudTasks()
    return f"Hello {who}!\n"


def dispatchToCloudTasks():
    # Construct the fully qualified queue name.
    parent = client.queue_path(project, location, queue)

    # Construct the request body.
    task = {
        "http_request": {  # Specify the type of request.
            "http_method": tasks_v2.HttpMethod.POST,
            "url": url,  # The full url path that the task will be sent to.
            "oauth_token": {"service_account_email": service_account_email},
        }
    }

    if payload is not None:
        # The API expects a payload of type bytes.
        converted_payload = payload.encode()

        # Add the payload to the request.
        task["http_request"]["body"] = converted_payload

    # Use the client to build and send the task.
    response = client.create_task(request={"parent": parent, "task": task})

    print("Created task {}".format(response.name))
    return response


if __name__ == "__main__":
    # Used when running locally only. When deploying to Cloud Run,
    # a webserver process such as Gunicorn will serve the app.
    app.run(host="localhost", port=8080, debug=True)