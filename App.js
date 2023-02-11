const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const addTextWatermarkToImage = async function(inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const textWidth = Jimp.measureText(font, text);
    const x = (image.bitmap.width - textWidth) / 2;
    const y = (image.bitmap.height - 32) / 2;
    image.print(font, x, y, text);
    await image.quality(100).writeAsync(outputFile);
    console.log(`File ${outputFile} was created successfully.`);
  } catch (error) {
    console.log('Something went wrong... Try again!');
    startApp();
  }
};

const addImageWatermarkToImage = async function(inputFile, outputFile, watermarkFile) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = (image.bitmap.width - watermark.bitmap.width) / 2;
    const y = (image.bitmap.height - watermark.bitmap.height) / 2;
    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.7
    });
    await image.quality(100).writeAsync(outputFile);
    console.log(`File ${outputFile} was created successfully.`);
  } catch (error) {
    console.log('Something went wrong... Try again!');
    startApp();
  }
};

const prepareOutputFilename = (filename) => {
  const [name, ext] = filename.split('.');
  return `${name}-with-watermark.${ext}`;
};

const startApp = async () => {
  
  const answer = await inquirer.prompt([{
    name: 'start',
    message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
    type: 'confirm'
  }]);
  
  if(!answer.start) process.exit();

  const options = await inquirer.prompt([{
    name: 'inputImage',
    type: 'input',
    message: 'What file do you want to mark?',
    default: 'test.jpg',
  }, {
    name: 'watermarkType',
    type: 'list',
    choices: ['Text watermark', 'Image watermark'],
  }]);

  if(options.watermarkType === 'Text watermark') {
    const text = await inquirer.prompt([{
      name: 'value',
      type: 'input',
      message: 'Type your watermark text:',
    }]);
    options.watermarkText = text.value;

    if (!fs.existsSync(`./img/${options.inputImage}`)) {
      console.log('Something went wrong... Try again');
      process.exit();
    }

    addTextWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), options.watermarkText);
  }

  else {
    const image = await inquirer.prompt([{
      name: 'filename',
      type: 'input',
      message: 'Type your watermark name:',
      default: 'logo.png',
    }])
    options.watermarkImage = image.filename;

    if (!fs.existsSync(`./img/${options.watermarkImage}`)) {
      console.log('Something went wrong. Please try again.');
      process.exit();
  }

    addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), './img/' + options.watermarkImage);
  }

}

startApp();