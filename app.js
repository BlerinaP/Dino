
//Function to get val of inputs inside form
function getInputValue(input){
    return document.getElementById(input).value;
}

// Create Dino Constructor
//Dino constructor will hold this data object, that we gonna fetch from dino.json file
function DinoConstructor(species, weight, height, fact, where, diet){
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.fact = fact;
    this.where = where;
    this.diet = diet;
    this.image = "images/" + species.toLowerCase() + ".png";
}

// Here we create methods to add new Facts
DinoConstructor.prototype.displayFact = function (fact) {
    this.fact.push(fact)
};
// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
DinoConstructor.prototype.compareHeight = function(height){
    let ourHeight = "We have the same height";
    if(this.height > height){
        ourHeight = "I am taller than you"
    } else if(this.height < height) {
        ourHeight = "I am shorter than you "
    }
    this.displayFact(ourHeight)
};
// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
DinoConstructor.prototype.compareWeight = function(weight){
    let fact = "We have the same weight";
    if(this.weight > weight){
        fact = "I am fatter than you"
    } else if(this.weight < weight) {
        fact = "I am skinnier than you "
    }
    this.displayFact(fact)
};
// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
DinoConstructor.prototype.compareName = function(name){
    let ourName = "Our names have the same length";
    if(this.name > name){
        ourName  = "My name is longer than yours"
    } else if(this.name < name) {
        ourName  = "My name is shorter than yours"
    }
    this.displayFact(ourName )
};

DinoConstructor.prototype.getRandomFact = function () {
    let number = Math.floor(Math.random() * 10) % this.fact.length;
    return this.fact[number];
};

// Create Dino Objects
function Dino(species, weight, height, facts) {
    DinoConstructor.call(this, species, weight, height, facts);
}
Dino.prototype = Object.create(DinoConstructor.prototype);
Dino.prototype.constructor = Dino;

// Create Human Object
function Human(name, weight, height){
    DinoConstructor.call(this, "human", weight, height )
    this.name = name;
}
Human.prototype = Object.create(DinoConstructor.prototype);
Human.prototype.constructor = Human;


//We use axios to get data from dino.json file
let dinosaurs = [];
fetch("dino.json")
    .then(response => response.json())
    .then(json => dinosaurs = json.Dinos.map(dino => new Dino(dino.species, dino.weight, dino.height, [dino.fact])));

// Use IIFE to get human data from form
//We created IFFE to get val from inputs  using getInputValue
function getHumanData() {
    return (function () {
        let name = getInputValue("name");
        let heightFeet = parseFloat(getInputValue("feet"));
        let heightInches = parseFloat(getInputValue("inches"));
        let weight = parseFloat(getInputValue("weight"));
        // 12 inch = 1 feet
        return new Human(name, weight, heightFeet * 12 + heightInches);
    })();
}

// Generate Tiles for each Dino in Array
function createGird(specie, image, fact){
    let divContainer = document.createElement('div');
    divContainer.className = 'grid-item';

    let specieTitle = document.createElement('h3');
    specieTitle.innerText = specie;
    divContainer.appendChild(specieTitle);

    let dinoImg = document.createElement('img');
    dinoImg.src = image;
    divContainer.appendChild(dinoImg);

    if(fact){
       let factContainer =  document.createElement('p');
        factContainer.innerText = fact;
        divContainer.appendChild(factContainer)
    }

    return divContainer
}


// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", function () {
    const human = getHumanData();
    dinosaurs.forEach(dinosaur => {
        dinosaur.compareWeight(human.weight);
        dinosaur.compareHeight(human.height);
        dinosaur.compareName(human.name);
    });

    document.getElementById("dino-compare").style.display = "none";
    dinoHtml(dinosaurs, human)
});


//For each div render this html
function dinoHtml(dinosaurs, human){
    for(let dinos in dinosaurs){
        console.log(dinos);
        let dino = dinosaurs[dinos];
        let fact = dino.getRandomFact()
        if (dino.weight == 0.5) {
            fact = "All birds are dinosaurs."
        }

        let gridItem = createGird(dino.species, dino.image, fact);

        document.getElementById("grid")
            .appendChild(gridItem);
        if (dinos == 3) {
            let humanTileDiv = createGird(human.species, human.image);
            document.getElementById("grid")
                .appendChild(humanTileDiv);
        }
    }

}