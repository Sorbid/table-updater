const fs = require("fs");
const path = require("path");

class FileHandler {
  constructor(folder) {
    this.checkFolder(folder);
    this.folder = folder;
  }

  async saveResultOnDisk(file) {
    try {
      const filename = this.generateFileName();
      const fullname = `${this.folder}/${filename}`;

      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(fullname);

        writeStream.write(JSON.stringify(file));

        writeStream.end(() => resolve(fullname));
        writeStream.on("error", reject);
      });
    } catch (error) {
      throw new Error("Ошибка при записи файла");
    }
  }

  checkFolder(folder) {
    if (!fs.existsSync(folder))
      throw new Error("Не инициализирован volume под папку " + folder);
  }

  /**
   * Генерирует уникальное имя файла.
   * @param {string} prefix - Префикс для файла (например, 'report', 'image').
   * @param {string} extension - Расширение файла (например, 'txt', 'jpg').
   * @returns {string} Уникальное имя файла.
   */
  generateFileName() {
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);

    return `${timestamp}_${uniqueId}.json`;
  }

  checkFile() {
    if (!fs.existsSync(this.fullname))
      throw new Error("Не найден файл" + this.fullname);
  }
}

module.exports = { FileHandler };
