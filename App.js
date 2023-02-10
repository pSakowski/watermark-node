const Jimp = require('jimp');
const inquirer = require('inquirer');

const addTextWatermarkToImage = async function(inputFile, outputFile, text) {
  const image = await Jimp.read(inputFile);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const textWidth = Jimp.measureText(font, text);
  const x = (image.bitmap.width - textWidth) / 2;
  const y = (image.bitmap.height - 32) / 2;
  
  image.print(font, x, y, text);
  await image.quality(100).writeAsync(outputFile);
};

addTextWatermarkToImage('./test.jpg', './test-with-watermark.jpg', 'Hello world');


const addImageWatermarkToImage = async function(inputFile, outputFile, watermarkFile) {
  const image = await Jimp.read(inputFile);
  const watermark = await Jimp.read(watermarkFile);
  const x = (image.bitmap.width - watermark.bitmap.width) / 2;
  const y = (image.bitmap.height - watermark.bitmap.height) / 2;

  image.composite(watermark, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.7
  });
  await image.quality(100).writeAsync(outputFile);
};

addImageWatermarkToImage('./test.jpg', './test-with-watermark2.jpg', './logo.png');


// const addTextWatermarkToImage = async function(inputFile, outputFile, text) {
//   const image = await Jimp.read(inputFile);
//   const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
//   const textData = {
//     text,
//     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
//     alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
//   };

//   image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
//   await image.quality(100).writeAsync(outputFile);
// };

// addTextWatermarkToImage('./test.jpg', './test-with-watermark.jpg', 'Hello world');


// const addImageWatermarkToImage = async function(inputFile, outputFile, watermarkFile) {
//   const image = await Jimp.read(inputFile);
//   const watermark = await Jimp.read(watermarkFile);
//   const x = image.getWidth() / 2 - watermark.getWidth() / 2;
//   const y = image.getHeight() / 2 - watermark.getHeight() / 2;

//   image.composite(watermark, x, y, {
//     mode: Jimp.BLEND_SOURCE_OVER,
//     opacitySource: 0.5,
//   });
//   await image.quality(100).writeAsync(outputFile);
// };

// addImageWatermarkToImage('./test.jpg', './test-with-watermark2.jpg', './logo.png');