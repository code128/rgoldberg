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
