simple-lyrics
====
Searches and retrieves lyrics from azlyrics.com

## Installation
`npm i simple-lyrics`

## Usage
It's *simple*:
```js
const getLyrics = require("simple-lyrics");

(async () => await getLyrics("shape of an L on her forehead"))(); // You could also just search by title.
```

This will return:
```
{
  lyrics: 'Somebody once told me the world is gonna roll me...',
  title: 'All Star',
  artist: 'Smash Mouth',
  url: 'https://www.azlyrics.com/lyrics/smashmouth/allstar.html'
}
```
That's it!
