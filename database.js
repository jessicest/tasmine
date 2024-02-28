
const CLIENT_ID = '782770083335-9gbfl194s0af9rkdh2bo6eh0vnms298h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDqneTvAliLhbPHHHM0rYVLjQdJmzL5fNA';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

console.log('zero');

if (window.location.hostname !== 'localhost') {
    gapi.load('client', initializeGapiClient);
    gisLoaded();
}

async function initializeGapiClient() {
    console.log('initializeGapiClient');
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    if (gisInited) {
        login();
    }
}

function gisLoaded() {
    console.log('gisLoaded');
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    if (gapiInited) {
        login();
    }
}

function login() {
    console.log('login');
    tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
            throw (response);
        }
        await loadFromDatabase();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

async function loadFromDatabase() {
    console.log('loadFromDatabase');
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1xvaR8InzlsIUnwK7_eZ0OQySN6vgb57oUR3tO3pZZJU',
            range: 'data!A1:Z',
        });
    } catch (err) {
        document.getElementById('debug').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('debug').innerText = 'No values found.';
        return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row, also) => `${str}${row[0]}, ${row[1]}, ${row[2]}\n`,
        'Name, Major:\n');
    document.getElementById('debug').innerText = output;
}

