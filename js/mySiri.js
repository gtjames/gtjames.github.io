// UI comp
//https://medium.com/swlh/build-your-own-hi-siri-with-80-lines-of-javascript-code-653540c77502
const startBtn = document.createElement("button");
startBtn.innerHTML = "Speak to me";
const result = document.createElement("div");
const processing = document.createElement("p");
document.write("<body><h1>My Siri</h1><p>Give it a try with 'hello', 'how are you', 'what's your name', 'what time is it', 'stop', ... </p></body>");
document.body.append(startBtn);
document.body.append(result);
document.body.append(processing);

// speech to text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") {
    startBtn.remove();
    result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
        const last = event.results.length - 1;
        const res = event.results[last];
        const text = res[0].transcript;
        if (res.isFinal) {
            processing.innerHTML = "processing ....";

            const response = process(text);
            const p = document.createElement("p");
            p.innerHTML = `You said: ${text} </br>Siri said: ${response}`;
            processing.innerHTML = "";
            result.appendChild(p);

            // text to speech
            speechSynthesis.speak(new SpeechSynthesisUtterance(response));
        } else {
            processing.innerHTML = `listening: ${text}`;
        }
    }
    let listening = false;
    toggleBtn = () => {
        if (listening) {
            recognition.stop();
            startBtn.textContent = "Start listening";
        } else {
            recognition.start();
            startBtn.textContent = "Stop listening";
        }
        listening = !listening;
    };
    startBtn.addEventListener("click", toggleBtn);
}

// processor
function process(rawText) {
    let text = rawText.replace(/\s/g, "");
    text = text.toLowerCase();
    let response = null;
    switch (text) {
        case "hello":           response = "hi, how are you doing?";        break;
        case "what'syourname":  response = "My name's Siri.";               break;
        case "howareyou":       response = "I'm good.";                     break;
        case "whattimeisit":    response = new Date().toLocaleTimeString(); break;
        case "who'syourdaddy":  response = 'that would be Gary';            break;
        case "stop":            response = "Bye!!"; toggleBtn();            break;
    }
    if (!response) {
        window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank");
        return `I found some information for ${rawText}`;
    }
    return response;
}