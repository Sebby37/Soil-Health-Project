// Global variables storing the sensor data
var moisture = null;
var nitrogen = null;
var phosphorus = null;
var potassium = null;
var temperature = null;
var humidity = null;
var raining = null;

// The function to ask an AI language model a question
function askQuestion() {
    // Get the elements we need
    let answerBox = document.getElementById("answerBox");
    let question = document.getElementById("questionInput");

    // Make sure the question is not empty
    if (question.value.length <= 0) {
        alert("Please enter a question!");
        return;
    }

    // Greying out the elements so the user doesn't try send another question
    answerBox.value = "";
    answerBox.disabled = true;
    question.disabled = true;
    document.getElementById("questionInput").disabled = true;

    // Construct the JSON to send to the llm
    let payload = new Object;
    payload.moisture = `${moisture}%`;
    payload.nitrogen = `${nitrogen} mg/kg`;
    payload.phosphorus = `${phosphorus} mg/kg`;
    payload.potassium = `${potassium} mg/kg`;
    payload.temperature = `${temperature} degrees Celcius`;
    payload.humidity = `${humidity}%`;
    payload.raining = `${raining}`;

    // Send request to server
    fetch("http://127.0.0.1:5000/", {
        mode: "cors",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Request-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Request-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        },
        body: JSON.stringify( {"question": question.value, "sensors": payload} )
    }).then(res => res.text()).then(function(res) {
        // Add the response to the box
        document.getElementById("answerBox").value = res;
        console.log(res);
    }).catch(function(error) {
        // Alerting of any failures
        alert("Request falied: ", error);
    }).finally(() => {
        // Re-enabling the elements
        document.getElementById("answerBox").disabled = false;
        document.getElementById("questionInput").disabled = false;
        document.getElementById("questionButton").disabled = false;
    });
}

// Function to update the DOM with the sensor data
function updateDom() {
    document.getElementById("moisture").innerHTML = `<b>Moisture:</b> ${moisture} %`;
    document.getElementById("nitrogen").innerHTML = `<b>Nitrogen:</b> ${nitrogen} mg/kg`;
    document.getElementById("phosphorus").innerHTML = `<b>Phosphorus:</b> ${phosphorus} mg/kg`;
    document.getElementById("potassium").innerHTML = `<b>Potassium:</b> ${potassium} mg/kg`;
    document.getElementById("temperature").innerHTML = `<b>Temperature:</b> ${temperature} *C`;
    document.getElementById("humidity").innerHTML = `<b>Humidity:</b> ${humidity} %`;
    document.getElementById("raining").innerHTML = `<b>Raining:</b> ${raining}`;
}