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

  getFile(fullpath) {
    this.checkFile(fullpath);

    return new Promise((resolve, reject) => {
      let data = "";
      const readStream = fs.createReadStream(fullpath);

      readStream.on("data", (chunk) => {
        data += chunk.toString();
      });
      readStream.on("end", () => resolve(JSON.parse(data)));

      readStream.on("error", reject);
    });
  }

  unlinkFile(fullpath) {
    if (fullpath) fs.unlinkSync(fullpath);
  }

  checkFile(fullpath) {
    if (!fs.existsSync(fullpath)) throw new Error("Не найден файл" + fullpath);
  }

  async saveResultOnDisk(body) {
    try {
      const filename = this.generateFileName();
      const fullname = path.join(this.folder, filename);

      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(fullname);

        writeStream.write(JSON.stringify(body));

        writeStream.end(() => resolve(fullname));
        writeStream.on("error", reject);
      });
    } catch (error) {
      throw new Error("Ошибка при записи файла");
    }
  }

  generateFileName() {
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);

    return `${timestamp}_${uniqueId}.json`;
  }
}

module.exports = FileHandler;
