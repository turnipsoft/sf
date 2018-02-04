export default class CategoryApi {

  static categoryMap = {
    "Pelican": "A Pelican",
    "Squirrel": "A Squirrel",
    "Robot": "A Robot",
    "Egg": "An Egg",
    "Top Model": "A Top Model",
    "Swimmer": "A Swimmer",
    "Painter": "A Painter",
    "Carpenter": "A Carpenter",
    "Race Car Driver": "A Race Car Driver",
    "Ballet Dancer": "A Ballet Dancer",
    "Bully": "A Bully",
    "Nerd": "A Nerd",
    "Hater": "A Hater",
    "Policeman": "A Policeman",
    "Jumper": "A Jumper",
    "Mercy": "Mercy From Overwatch",
    "Donald Trump": "Donald Trump",
    "Wolf": "A Wolf",
    "Justin Bieber": "Justin Bieber",
    "Metal Dude": "A Heavy Metal Dude",
    "Popsinger": "A Pop Singer",
    "Artist": "An Artist",
    "Wiseguy": "A Wiseguy",
    "Designer": "A Designer",
    "Computer Programmer": "A Computer Programmer",
    "Pig": "A Pig",
    "Horse": "A Horse",
    "Goblin": "A Goblin",
    "Swordsman": "A Swordsman",
    "Princess": "A Princess",
    "King": "A King",
    "Sausage": "A Sausage",
    "Peter Pan": "Peter Pan",
    "Mouse": "A Mouse",
    "Snake": "A Snake",
    "Cat": "A Cat",
    "Billy": "Billy",
    "Wonderwoman": "Wonderwoman",
    "Phone": "A Phone",
    "Chair": "A Chair",
    "Musical Singer": "Musical Singer",
    "Drummer": "A Drummer",
    "Guitar Player": "A Guitar Player",
    "Singer": "A Singer",
    "Trumpet Player": "A Trumpet Player",
    "Baker": "A Baker",
    "Shop Assistant": "A Shop Assistant",
    "Dentist": "A Dentist",
    "Goat": "A Goat",
    "Cow": "A Cow",
    "Alligator": "An Alligator",
    "Ali Baba": "Ali Baba"
  }

  static getCategory() {
    const max = Object.keys(CategoryApi.categoryMap).length-1;
    const idx=Math.floor(Math.random() * Math.floor(max));

    let c = 'NONE';
    Object.keys(CategoryApi.categoryMap).forEach( (key, index)=>{
      if (index===idx) {
        c = CategoryApi.categoryMap[key];
      }
    });

    return c;
  }
}
