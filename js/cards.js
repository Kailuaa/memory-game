const cards = [
    {
        id: 1,
        image: "images/image 21.svg",
    },
    {
        id: 2,
        image: "images/image 22.svg",
    },
    {
        id: 3,
        image: "images/image 24.svg",
    },
    {
        id: 4,
        image: "images/image 25.svg",
    },
    {
        id: 5,
        image: "images/image 26.svg",
    },
    {
        id: 6,
        image: "images/image 27.svg",
    },
    {
        id: 7,
        image: "images/image 28.svg",
    },
    {
        id: 8,
        image: "images/image 29.svg",
    }
]; 

const duplicatedCards = cards.map(card => [{...card}, {...card}]).flat();
// export const shuffledCards = shuffle(duplicatedCards);

// function shuffle(array) {
//   let m = array.length, t, i;

//   // While there remain elements to shuffle…
//   while (m) {

//     // Pick a remaining element…
//     i = Math.floor(Math.random() * m--);

//     // And swap it with the current element.
//     t = array[m];
//     array[m] = array[i];
//     array[i] = t;
//   }

//   return array;
// }

export function createShuffledCards() {
    let shuffledCards = [...duplicatedCards];
    let m = shuffledCards.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = shuffledCards[m];
    shuffledCards[m] = shuffledCards[i];
    shuffledCards[i] = t;
  }

  return shuffledCards;
}


