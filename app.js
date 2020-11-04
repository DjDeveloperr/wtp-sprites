const { createCanvas, loadImage } = require("canvas")

const create = async (url) => {
  const img = await loadImage(url)

  const cvs = createCanvas(img.width, img.height)
  const ctx = cvs.getContext('2d')

  ctx.drawImage(img, 0, 0, img.width, img.height)

  const im = ctx.getImageData(0, 0, img.width, img.height)

  for(let i = 0; i < im.data.length; i += 4) {
    let red = im.data[i + 0];
    let green = im.data[i + 1];
    let blue = im.data[i + 2];
    let alpha = im.data[i + 3];

    let anycol = red != 0 && green != 0 && blue != 0;
    if(alpha != 0) {
      im.data[i + 0] = 0;
      im.data[i + 1] = 0;
      im.data[i + 2] = 0;
    }
  }

  ctx.putImageData(im, 0, 0);
  return cvs.toBuffer();
}

const save = (file, url) => create(url).then(data => require("fs").writeFileSync("./sprites/" + file, data))

;(async() => {
  const start = 1;
  const end = 890;
  for (let id = start; id <= end; id ++) {
    await save(id + ".png", "https://www.cpokemon.com/pokes/pokemon-artwork/" + id + ".png");
    console.log("Saved " + id + ".png !");
  }
})()
