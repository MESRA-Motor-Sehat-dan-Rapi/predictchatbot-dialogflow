const dotenv = require("dotenv").config()
const express = require("express")
const dialogflow = require("dialogflow")
const uuid = require('uuid');
const PORT = process.env.PORT || 7000
const projectId = process.env.PROJECT_ID
const credentialsPath = process.env.CREDENTIALS_PATH

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath

async function runSample(userMessage) {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentText;
  const queryText = responses[0].queryResult.queryText;

  if (result) {
    return {
      user: queryText,
      bot: result
    }
  } else {
    throw new Error("No intent matched")
  }
}

const app = express()

// Middleware to parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const userMessage = req.body.message || req.query.message; // To support both URL-encoded and query params
        const result = await runSample(userMessage);
        return res.status(200).json({ message: "Success", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
})

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
      console.log(error)  
    }
}

start()
