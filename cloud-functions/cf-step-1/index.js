/*
    @joshbloom@google.com Step-1
    This cloud function calls the workflow to start the Serverless Rube Goldberg Machine, 
    by getting a Firestore document ID from a workflow for the front end to monitor. 
        The front end webpage can't call the workflow directly as Workflows need auth to be invoked. 
        The CF sits in front of the workflow as a kind of proxy to trigger it. 
 */

        const projectId = process.env.PROJECT_ID;
        const workflow = 'step1-get-firestore-document-id';
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
          const workflowsAPI = await callWorkflowsAPI();
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
        async function callWorkflowsAPI() {
          
          // Execute workflow
          try {
            const createExecutionRes = await client.createExecution({
              parent: client.workflowPath(projectId, location, workflow),
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