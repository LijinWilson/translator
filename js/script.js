const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
selectTag = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".exchange"),
translateBtn = document.querySelector("button"),  //translate text button
icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // console.log(countries[country_code]);
        // Selecting english by default as FROM language and hindi as TO language 
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        } else if(id == 1 && country_code == "hi-IN") {
            selected = "selected";
         }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend",option ); //add options tag inside select tag
    } 
});

exchangeIcon.addEventListener("click", () => {
    // exchanging text area and tag values
    let tempText = fromText.value; // swapping the content
    tempLang = selectTag[0].value;//swapping the language 
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
})

translateBtn.addEventListener("click",() =>{
    let text = fromText.value,
    translateFrom = selectTag[0].value, //geting fromSelect tag value
    translateTo = selectTag[1].value; // getting toSelect tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating....")
    // console.log(text, translateFrom, translateTo);
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    // fetching api response and returning it  with parsing into js obj
    // and in another then method we are recieving thta obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        // console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");

    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target})=>{
        // console.log(target);
        if(target.classList.contains("fa-copy")){
            // if we clicked icon has from id, copy the fromtextarea value else copy the totextarea value
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            }
            else{
                navigator.clipboard.writeText(toText.value);
            }
        }
        else{
            let utterance;
            // if we clicked icon has from id, speak the fromtextarea value else speak the totextarea value

            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; //setting utterance language to fromselect tag value
            }
            else{
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;//setting utterance language to toselect tag value
            }
            speechSynthesis.speak(utterance); // speak the passed utterances
        }
    });
})