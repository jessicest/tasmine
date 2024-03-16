
const INFO = "98j43f9ajfsdofijODFIJSFOEIJFjajfp33983fjdiFSJFDK";
let passport = localStorage.getItem('passport');

async function initDatabase() {
}

async function login() {
    try {
        const response = await fetch(`/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                info: INFO,
                passport,
            })
        });
        if (!response.ok) {
            throw "omg lol";
        }
        const json = await response.json();
        console.log(json);
        localStorage.setItem('passport', json.passport);
    } catch (error) {
        console.log(`uh oh! ${error}`);
    }
}

async function loadFromDatabase() {
    try {
        const response = await fetch(`/dump`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                info: INFO,
                passport,
            })
        });

        if (!response.ok) {
            throw "zomg lol";
        }
        const json = await response.json();
        console.log(json);
        //return range.values;
    } catch (error) {
        console.log(`oh uh! ${error}`);
    }
}
