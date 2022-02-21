// javascript
document.addEventListener("DOMContentLoaded", () => {
    // let quotes = [];
    const inputField = document.getElementById("input")
    inputField.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            let input = inputField.value;
            inputField.value = "";
            console.log(`I typed ${input}`);
            output(input);
            updateQuote();
            updateJoke();
    }
  });
});
let quotes = ["You have enemies? Good. That means you've stood up for something, sometime in your life."];
async function updateQuote() {
    // Fetch a random quote from the Quotable API
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    //console.log(data);
    const strData = JSON.stringify(data.content);
    //console.log(strData);
    if (response.ok) {
        quotes = data.content;
      // Update DOM elements
      // cite.textContent = data.author;
    } else {
      quotes.push("Please try again");
      console.log(data);
    }
  }
  
let jokes = ["Hear about the new restaurant called Karma? There’s no menu: You get what you deserve."];
async function updateJoke(){
const request = await fetch("https://api.icndb.com/jokes/random");
const joke = await request.json();
if (request.ok) {
        jokes = joke.value.joke;
    } 
else {
      jokes.push("Please try again");
      console.log(joke);
     }
}

function output(input){
      let product;
  // Regex remove non word/space chars
  // Trim trailing whitespce
  // Remove digits - not sure if this is best
  // But solves problem of entering something like 'hi1'

  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")   // 'tell me a story' -> 'tell me story'
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you");
    
    if (compare(prompts, replies, text)){
        // search for exact match in `prompts`
        product = compare(prompts, replies, text);
        addChat(input, product);
    }
    else if (text.match(/thank/gi)){
        product = "You're Welcome!";
        addChat(input, product);
    }
    else if (text.match(/(corona|covid|virus)/gi)){
        // if no match, check if message contains `coronavirus`
        product = coronavirus[Math.floor(Math.random() * coronavirus.length)];
        addChat(input, product);
    }
    else if (text.match(/(quote|quotes)/gi)){
        // if no match, check if message contains `quote`
        product = quotes[Math.floor(Math.random() * quotes.length)];
        addChat(input, `${quotes}`);
    }
    else if (text.match(/(joke|jokes)/gi)){
        // if no match, check if message contains `joke`
        product =jokes[Math.floor(Math.random() * jokes.length)];
        addChat(input, `${jokes}`);
    }
    else{
        // if all else fails -> random alternatives
        product = alternatives[Math.floor(Math.random() * alternatives.length)];
        addChat(input, product);
    }
    // Update DOM
    // addChat(input, product);
}

function compare(promptsArray, repliesArray, string){
    let reply;
    let replyFound = false;
    for (let x = 0; x < promptsArray.length; x++){
        for(let y = 0; y < promptsArray[x].length; y++){
            if (promptsArray[x][y] === string){
                let replies = repliesArray[x];
                reply = replies[Math.floor(Math.random()*replies.length)];
                replyFound = true;
                // stop inner loop when input value matches prompts
                break;
            }
        }
        if (replyFound){
            // stop outer loop when reply is found instead of iteration throught the entire array
            break;
        }
    }
    return reply;
}

function addChat(input, product){
    const messageContainer = document.getElementById("messages");
    
    let userDiv = document.createElement("div"); 
    userDiv.id = "user";
    userDiv.className = "user response";
    userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
    messageContainer.appendChild(userDiv);
    
    let botDiv = document.createElement("div");
    let botImg = document.createElement("img");
    let botText = document.createElement("span");
    botDiv.id = "bot";
    botImg.src = "bot.png";
    botImg.className = "avatar";
    botDiv.className = "bot response";
    botText.innerText = "Typing..";
    botDiv.appendChild(botText);
    botDiv.appendChild(botImg);
    messageContainer.appendChild(botDiv);
    // keeps messages at most recent
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    
    // fake delay for bot message
    setTimeout(() => {
        // botText.innerText = `${product}`;
        botText.textContent = `${product}`;
        textToSpeech(product)
    }, 2000)
    
}
