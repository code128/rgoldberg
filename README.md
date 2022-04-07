# rgoldberg

An experiment to link as many GCP products as possible (with a focus on serverless) to do something simple. Ala Rube Goldberg. 
This app attemps to recreate a sentence you pass in by guessing the correct characters one by one.
Guessing all of them in the correct order would take more time then we have left in the universe. 

- App Engine 
    - hosts a Node App that guesses characters
- Cloud Functions
    - hosts a Node function that guesses characters
    - hosts 2 functions that relay requests to workflows
- Cloud Run 
    - hosts a Node container that guesses characters
    - hosts the front end website
- Firebase 
    - We use Firestore to log all the guesses and handle communication with the front end website
- Workflows 
    - 1st workflow creates a firestore document
    - 2nd workflow breaks the sentence into characters and farms it via parallel iteration across AE, CF, CR and writes results to firestore

# Features to think about adding
- Another guesser based on a quantum processor
- Some kind of analytics process to count and display some statistics of usage
- Retry without the window.alert() when starting fails (probably related to cold starts on Cloud Functions) 


# Products to think about integrating
- Cloud Scheduler (trigger analytics jobs?)
- EventArc 
- Cloud Build (CI/CD Pipeline for everything)
- Cloud Storage (move site hosting here?)
- Cloud Tasks? 
- Cloud Logging
    - SLO monitoring/alerting? 
- Pub/Sub 

# Things that have been added
- Custom Domain (via CR Domains)
- Fixed the Safari issue (result.toString() Mobile Support)
- icons not loading (file permissions issue)


4-5-22
Attempting to redeploy this solution. 

1. Create a firebase config that can be used for the front end 
    1.   apiKey: "...",
        projectId: "serverless-rube-goldberg",
    1. Create a firestore DB
        1. Set test mode for open r/w access for now
1. Update the index.html with new keys
1. CR front end
    1. gcloud auth login for account/project
    1. gcloud run deploy rube-goldberg-front-end --source .
        1. https://rube-goldberg-front-end-7f55cmy2ga-uc.a.run.app
1. CR Random Letter Generator
    1. gcloud run deploy rg-random-letter --source .   
        1. https://rg-random-letter-7f55cmy2ga-uc.a.run.app
1. CF
    1. Random Letter
        1. gcloud functions deploy cf-random-letter --entry-point random_letter --runtime nodejs16  --trigger-http
            1. https://us-central1-serverless-ux-playground.cloudfunctions.net/cf-random-letter
    1. cf-step-1
        1. gcloud functions deploy cf-step-1 --entry-point runWorkflow --runtime nodejs16  --trigger-http
            1. https://us-central1-serverless-ux-playground.cloudfunctions.net/cf-step-1
    1. cf-step-2
        1. gcloud functions deploy cf-step-2 --entry-point runWorkflow --runtime nodejs16  --trigger-http
            1. https://us-central1-serverless-ux-playground.cloudfunctions.net/cf-step-2
1. App Engine
    1. random-letter
        1. gcloud app deploy --project serverless-ux-playground --version v1 --promote --quiet
            1. https://serverless-ux-playground.ey.r.appspot.com/
1. Workflows
    1. step1
        1. gcloud beta workflows deploy step1-get-firestore-document-id --source=step1-get-firestore-document-id.yaml
    1. step2
        1. gcloud beta workflows deploy step2-process-sentence --source=step2-process-sentence.yaml
    

Things I missed. 
Making sure function/workflow naming is correct
Adding the PROJECT_ID env vars to the Cloud Functions
Creating the collection called "Sentences" in firestore
Make sure firestore db rules are correct 
Make sure firebase is the same project as the functions&workflows
Make sure CF service account can invoke the workflows. 