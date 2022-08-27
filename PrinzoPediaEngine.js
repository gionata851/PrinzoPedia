/*dichiarazione variabili scope globale*/

const serverurl = 'https://api.dictionaryapi.dev/api/v2/entries/';
var lang = '';
var vocabolo = '';
var definitionObject;
var mainsection;

window.onload = function()
			{
				document.getElementById('vocabolo').addEventListener("keypress", function(event) { enter(event); }, false);
			}
            

/* funzione di ricerca */
function ricerca(){
    mainsection = document.querySelector('main');
    mainsection.innerHTML = '';
    lang = document.spedizione_vocabolo.lang.value;
    vocabolo = document.spedizione_vocabolo.vocabolo.value.toLowerCase().replace(/ /g, '');
    // console.log(vocabolo);
    if(vocabolo === ''){
        return;
    }
    var ricerca = new Promise ((resolve,reject) => {

        //let risposta;
        let req = new XMLHttpRequest();
        req.open('GET',`${serverurl}${lang}/${vocabolo}`);
        req.send();
        req.onreadystatechange = () => {
            setTimeout( () => {
                if (req.readyState == 4 && req.status == 200){
                    definitionObject = JSON.parse(req.responseText);
                    resolve(definitionObject);
                    console.log("successfully resolved");
                } else if (req.readyState == 4 && req.status == 404){
                    definitionObject = JSON.parse(req.responseText);
                    console.log("error 404");
                    reject(definitionObject);
                } else {
                    definitionObject = JSON.parse(req.responseText);
                    console.log("generic error");
                    reject(definitionObject);
                }
            },50);
        }
        
    })
    ricerca
        .then( (unfilteredDefinitionObject) => {
            definitionObject = unfilteredDefinitionObject.filter((obj) => { return (obj.meanings != false) });

            let wordsfound = document.createElement('div');
            wordsfound.setAttribute('class','wordsfound');
            if(definitionObject.length > 1)
                wordsfound.innerText = `${definitionObject.length} words found`;
            mainsection.appendChild(wordsfound);
            
            definitionObject.forEach((wordfound) =>{
                console.log(wordfound);
                let wordcontainer = document.createElement('div');
                wordcontainer.setAttribute('class','wordcontainer');
                mainsection.appendChild(wordcontainer);

                let word = document.createElement('div');
                word.setAttribute('class','wordhead word');
                word.innerText = wordfound.word;
                wordcontainer.appendChild(word);
                //console.log("cond 1: " + wordfound.phonetics[0].text ? "exists" : "FALSE");
                //console.log("cond 2: " + wordfound.phonetics.length);
                if(wordfound.phonetics.length != 0){

                    let phonetics = document.createElement('div');
                    phonetics.setAttribute('class','wordhead phonetics');
                    phonetics.innerText = wordfound.phonetics[0].text || '' + wordfound.phonetics[1].text || '' + wordfound.phonetics[2].text || ''
                    wordcontainer.appendChild(phonetics);
                }

                wordfound.meanings.map((meaning) => {
                    let partofspeech = document.createElement('div');
                    partofspeech.setAttribute('class','meaninghead pos');
                    partofspeech.innerText = meaning.partOfSpeech;
                    wordcontainer.appendChild(partofspeech);
                    meaning.definitions.map((definition) =>{
                        let def = document.createElement('div');
                        def.setAttribute('class','wordbody def');
                        def.innerText = definition.definition;
                        wordcontainer.appendChild(def);
                        
                        if(definition.synonyms && definition.synonyms != false){
                            let syn = document.createElement('div');
                            syn.setAttribute('class','wordbody syn');
                            syn.innerText ='Synonyms: ' +  definition.synonyms;
                            wordcontainer.appendChild(syn);
                        }
                        if(definition.example){
                            let example = document.createElement('div');
                            example.setAttribute('class','wordbody example');
                            example.innerText ='Example: ' +  definition.example;
                            wordcontainer.appendChild(example);
                        }
                    })
                })


            })



        })
        .catch( (definitionObject) => {
            mainsection = document.querySelector('main');
            mainsection.innerHTML = '';
            let wordsfound = document.createElement('div');
            wordsfound.setAttribute('class','word');
            wordsfound.innerHTML = definitionObject.title;
            mainsection.appendChild(wordsfound);

            let message = document.createElement('div');
            message.setAttribute('class','syn');
            message.innerHTML = definitionObject.message;
            mainsection.appendChild(message);

            let resolution = document.createElement('div');
            resolution.setAttribute('class','pos');
            resolution.innerHTML = definitionObject.resolution;
            mainsection.appendChild(resolution);
            // document.querySelectorAll('.def')[0].innerHTML = `${definitionObject.message} <br>
            // ${definitionObject.resolution}`;
        })
}

function enter(event){
    if(event.keyCode === 13) {
        event.preventDefault()
        ricerca();
    }
};