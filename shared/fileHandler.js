const fs = require("fs");
const path = require("path");

class FileHandler {
  constructor(folder) {
    this.checkFolder(folder);
    this.folder = folder;
  }

  checkFolder(folder) {
    if (!fs.existsSync(folder))
      throw new Error("Не инициализирован volume под папку " + folder);
  }

  getFile(file) {
    this.fullname = file;

    this.checkFile();

    return new Promise((resolve, reject) => {
      let data = "";
      const readStream = fs.createReadStream(file);

      readStream.on("data", (chunk) => {
        data += chunk.toString();
      });
      readStream.on("end", () => resolve(JSON.parse(data)));

      readStream.on("error", reject);
    });
  }

  unlinkFile() {
    if (this.fullname) fs.unlinkSync(this.fullname);
  }

  checkFile() {
    if (!fs.existsSync(this.fullname))
      throw new Error("Не найден файл" + this.fullname);
  }
}

module.exports = FileHandler;
