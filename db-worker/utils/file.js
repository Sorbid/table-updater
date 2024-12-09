const fs = require("fs");
const path = require("path");

class FileHandler {
  constructor(folder) {
    checkFolder(folder);
    this.folder = folder;
  }

  getFile(file) {
    this.fullname = file;

    this.checkFile();

    try {
      const content = fs.readFileSync(this.fullname, "utf-8");

      return content;
    } catch (error) {
      throw new Error("Ошибка при записи файла");
    }
  }

  unlinkFile() {
    if (this.fullname) fs.unlinkSync(this.fullname);
  }

  checkFile() {
    if (!fs.existsSync(this.fullname))
      throw new Error("Не найден файл" + this.fullname);
  }
}

function checkFolder(folder) {
  if (!fs.existsSync(folder))
    throw new Error("Не инициализирован volume под папку " + folder);
}

module.exports = { FileHandler, checkFolder };
