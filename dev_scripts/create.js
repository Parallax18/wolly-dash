const { getFileObj, replaceTemplate } = require("./fileMaps");
const fs = require("fs");
const path = require("path");

let type = process.argv[2];
let name = process.argv[3];

const run = () => {
  const fileObj = getFileObj(type);
  if (!fileObj)
    return console.error(`Create is unsupported for type '${type}'`);
  if (fileObj.files) {
    let parent = path.join(__dirname, "..", "src", fileObj.folder, name);
    if (fs.existsSync(parent))
      return console.error(`Error ${type} with name '${name}' already exists`);
    fs.mkdirSync(parent);
    let files = Object.entries(fileObj.files);
    files.forEach((fileEntry) => {
      let fileName = replaceTemplate(fileEntry[0], "name", name);
      let text = replaceTemplate(fileEntry[1].createStr, "name", name);
      fs.writeFileSync(path.join(parent, fileName), text);
    });
  } else if (fileObj.file) {
    let filePath = path.join(
      __dirname,
      "..",
      "src",
      fileObj.folder,
      `${name}${fileObj.extension}`
    );
    if (fs.existsSync(filePath))
      return console.error(`Error ${type} with name '${name}' already exists`);
    let text = replaceTemplate(fileObj.file.createStr, "name", name);
    fs.writeFileSync(filePath, text);
  }
  return console.log(`Successfully added ${fileObj.folder} '${name}'`);
};

run();
