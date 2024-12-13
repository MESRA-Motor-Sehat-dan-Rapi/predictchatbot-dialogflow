# Dialogflow Integration with Express.js

## Description
This project demonstrates how to integrate a Dialogflow agent with an Express.js server. The application allows users to send queries to a Dialogflow agent and receive responses via a RESTful API.

## Features
- Query Dialogflow agent using REST API.
- Handle user queries and return bot responses.
- Use environment variables for configuration.

## Prerequisites
1. **Node.js** (version 14 or higher recommended)
2. **Dialogflow Agent** created on [Dialogflow Console](https://dialogflow.cloud.google.com/).
3. **Google Cloud Project** with the following APIs enabled:
   - Dialogflow API
   - IAM & Admin API
4. **Service Account Key JSON** for authenticating with Google Cloud.
5. **gcloud CLI** (optional, for deployment to Google Cloud).

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=7000
   PROJECT_ID=your-dialogflow-project-id
   CREDENTIALS_PATH=./credential.json
   ```

4. Add your **Service Account Key JSON**:
   - Download the JSON key from the [Google Cloud Console](https://console.cloud.google.com/).
   - Place the file in the project directory and name it `credential.json` (or update `CREDENTIALS_PATH` in `.env`).

## Usage

### Running Locally
1. Start the server:
   ```bash
   npm start
   ```

2. Send a GET request to the server:
   - URL: `http://localhost:7000/?message=Your+Message`

3. Example Response:
   ```json
   {
       "message": "Success",
       "result": {
           "user": "Your Message",
           "bot": "Response from Dialogflow"
       }
   }
   ```

### Deploying to Google Cloud Run
1. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```

2. Deploy the application:
   ```bash
   gcloud run deploy dialogflow-integration \
       --source . \
       --platform managed \
       --region <your-region> \
       --set-env-vars GOOGLE_APPLICATION_CREDENTIALS=/path/to/credential.json \
       --set-env-vars PROJECT_ID=your-dialogflow-project-id
   ```

3. Access the deployed service and query it via the URL provided by Cloud Run.

## Project Structure
```
.
├── credential.json        # Service Account Key JSON (not included in repo)
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── server.js              # Main server code
└── README.md              # Project documentation
```

## Code Overview

### Main Components
1. **Dialogflow Integration**
   - The `runSample` function interacts with Dialogflow API to send user queries and fetch bot responses.

   ```javascript
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
       return {
           user: responses[0].queryResult.queryText,
           bot: responses[0].queryResult.fulfillmentText,
       };
   }
   ```

2. **Express.js Server**
   - A simple Express server exposes an API endpoint to handle user queries.

   ```javascript
   app.get("/", async (req, res) => {
       try {
           const userMessage = req.query.message;
           const result = await runSample(userMessage);
           return res.status(200).json({ message: "Success", result });
       } catch (error) {
           console.error(error);
           return res.status(500).json({ message: "Server error", error });
       }
   });
   ```

## Troubleshooting

1. **Malformed Request Error (400)**
   - Ensure that `userMessage` is not empty or null.
   - Validate `GOOGLE_APPLICATION_CREDENTIALS` path and `PROJECT_ID`.

2. **Environment Variable Issues**
   - Confirm that `.env` file is properly configured and loaded.

3. **Dialogflow API Error**
   - Check Google Cloud Logs for more details: [Logs Explorer](https://console.cloud.google.com/logs).


## Cloud Computing's Team

|Name |Bangkit ID| University|
|-----|----------|-----------|
|Arifatus Fitriani |C296B4KX0643 |Universitas Pembangunan Nasional Veteran Jawa Timur |
|Mochammad Irfan Efendi |C202B4KY2532 |Universitas Dr Soetomo |



## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For any further questions, feel free to contact the project owner.

