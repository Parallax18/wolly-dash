const { getFileObj, replaceTemplate } = require("./fileMaps");
const fs = require("fs");
const path = require("path");

const type = process.argv[2];
const originalName = process.argv[3];
const newName = process.argv[4];

const run = () => {
  const fileObj = getFileObj(type);
  if (!fileObj)
    return console.error(`Create is unsupported for type '${type}'`);
  if (fileObj.files) {
    let oldParent = path.join(
      __dirname,
      "..",
      "src",
      fileObj.folder,
      originalName
    );
    let newParent = path.join(__dirname, "..", "src", fileObj.folder, newName);
    if (!fs.existsSync(oldParent))
      return console.error(
        `Error ${type} with name '${originalName}' doesn't exist`
      );
    if (fs.existsSync(newParent))
      return console.error(
        `Error ${type} with name '${newName}' already exists`
      );
    fs.mkdirSync(newParent);
    let files = Object.entries(fileObj.files);
    files.forEach((fileEntry) => {
      let oldFileName = replaceTemplate(fileEntry[0], "name", originalName);
      let newFileName = replaceTemplate(fileEntry[0], "name", newName);
      let oldFileStr = fs
        .readFileSync(path.join(oldParent, oldFileName))
        .toString();
      let text = "";
      if (fileEntry[1].renameContents) {
        text = oldFileStr.replace(new RegExp(`${originalName}`, "g"), newName);
      } else {
        text = oldFileStr;
      }
      fs.unlinkSync(path.join(oldParent, oldFileName));
      fs.writeFileSync(path.join(newParent, newFileName), text);
    });
    fs.rmdirSync(oldParent);
  } else if (fileObj.file) {
    let filePath = path.join(
      __dirname,
      "..",
      "src",
      fileObj.folder,
      `${originalName}${fileObj.extension}`
    );
    if (fs.existsSync(filePath))
      return console.error(
        `Error ${type} with name '${originalName}' already exists`
      );
    let text = replaceTemplate(fileObj.file, "name", originalName);
    fs.writeFileSync(filePath, text);
  }
  return console.log(
    `Successfully renamed ${fileObj.folder} '${originalName}' to '${newName}'`
  );
};

run();
