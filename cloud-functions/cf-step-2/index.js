/*
    @joshbloom@google.com Step-2
    This cloud function calls the next workflow in the Serverless Rube Goldberg Machine
    passing in the sentence to match 
        The front end webpage can't call the workflow directly as Workflows need auth to be invoked. 
        The CF sits in front of the workflow as a kind of proxy to trigger it. 
 */

        const projectId = process.env.PROJECT_ID;
        const workflow = 'step2-process-sentence';
        const location = 'us-central1';
        
        
        /**
         * Run Workflow Cloud Function
         */
        exports.runWorkflow = async (req, res) => {
          res.set('Access-Control-Allow-Origin', '*');
        
          if (req.method === 'OPTIONS') {
            // Send response to OPTIONS requests
            res.set('Access-Control-Allow-Methods', 'POST');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            res.status(204).send('');
          }
        
          if (req.method !== 'POST') {
            return res.status(405).send('Only POST method is allowed');
          }
          const sentence = (req.body.sentence);
          const fs_document = (req.body.fs_document);
        
          console.log("here");
          console.log(sentence);
          console.log(fs_document);
        
          const workflowsAPI = await callWorkflowsAPI(sentence, fs_document);
          if (!workflowsAPI.success) {
            return res.status(400).send(`Error running workflow. Result: ${workflowsAPI.result}`)
          }
          res.send(`Result: ${workflowsAPI.result}`);
        };
        
        const {ExecutionsClient} = require('@google-cloud/workflows');
        const client = new ExecutionsClient();
        
        /**
         * Calls the Workflow API and waits for the execution result.
         */
        async function callWorkflowsAPI(sentence, fs_document) {
          
          // Execute workflow
          try {
            const createExecutionRes = await client.createExecution({
              parent: client.workflowPath(projectId, location, workflow),
              execution: {argument: JSON.stringify({"sentence": sentence,"fs_document": fs_document})}
            });
            
            const executionName = createExecutionRes[0].name;
            console.log(`Created execution: ${executionName}`);
        
            // Wait for execution to finish, then print results.
            let executionFinished = false;
            let backoffDelay = 1000; // Start wait with delay of 1,000 ms
            console.log('Poll every second for result...');
            while (!executionFinished) {
              const [execution] = await client.getExecution({
                name: executionName,
              });
              executionFinished = execution.state !== 'ACTIVE';
        
              // If we haven't seen the result yet, wait a second.
              if (!executionFinished) {
                console.log('- Waiting for results...');
                await new Promise(resolve => {
                  setTimeout(resolve, backoffDelay);
                });
                backoffDelay *= 2; // Double the delay to provide exponential backoff.
              } else {
                console.log(`Execution finished with state: ${execution.state}`);
                console.log(execution.result);
                return {
                  success: true,
                  result: execution.result
                };
              }
            }
          } catch (e) {
            console.error(`Error executing workflow: ${e}`);
            return {
              success: false,
            };
          }
        }