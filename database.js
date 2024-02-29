
const CLIENT_ID = '782770083335-9gbfl194s0af9rkdh2bo6eh0vnms298h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDqneTvAliLhbPHHHM0rYVLjQdJmzL5fNA';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;

async function initDatabase() {
    console.log('b1');
    await new Promise((resolve, reject) => {
        gapi.load("client", {callback: resolve, onerror: reject});
    });

    console.log('b2');
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    console.log('b3');

    console.log('a2');
    await login();
    console.log('a3');
}

async function initializeGapiClient() {
    console.log('a4');
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    console.log('a5');
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

        console.log('a6');
        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''});
        }
        console.log('a7');
    });
}

async function loadFromDatabase() {
    console.log('a8');
    let response;
    try {
        response = gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1xvaR8InzlsIUnwK7_eZ0OQySN6vgb57oUR3tO3pZZJU',
            range: 'data!A1:C',
        });
    } catch(error) {
        throw error.message;
    }

    const range = response.result;

    if (range && range.values && range.values.length > 0) {
        return range.values;
    } else {
        throw 'no values found tho';
    }
}

