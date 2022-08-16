// takes in width and height - returns a random HD img of that size
export function makeAnImg(width, height) {
  let randNum = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/${width}/${height}?random=${randNum}`
}
