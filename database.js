
const CLIENT_ID = '782770083335-9gbfl194s0af9rkdh2bo6eh0vnms298h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDqneTvAliLhbPHHHM0rYVLjQdJmzL5fNA';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;

async function initDatabase() {
    await new Promise((resolve, reject) => {
        gapi.load("client", {callback: resolve, onerror: reject});
    });

    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

function login() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });

    return new Promise((resolve, reject) => {
        tokenClient.callback = (response) => {
            if (response.error === undefined) {
                resolve();
            } else {
                reject(response);
            }
        };

        tokenClient.requestAccessToken();
        /*
        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken();
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''});
        }
        */
    });
}

async function loadFromDatabase() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1xvaR8InzlsIUnwK7_eZ0OQySN6vgb57oUR3tO3pZZJU',
            range: 'data!A2:D',
        });
    } catch(error) {
        throw error.message;
    }

    const range = response.result;

    if (range && range.values && range.values.length > 0) {
        console.log(range);
        return range.values;
    } else {
        throw 'no values found tho';
    }
}

