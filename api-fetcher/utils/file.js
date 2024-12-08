const fs = require("fs");
const path = require("path");

async function saveResultOnDisk(folder, file) {
  try {
    const filename = generateFileName();
    const fullname = `${folder}/${filename}`;

    fs.writeFileSync(fullname, file);

    return fullname;
  } catch (error) {
    throw new Error("Ошибка при записи файла");
  }
}

function checkFolder(folder) {
  if (!fs.existsSync(folder))
    throw new Error("Не инициализирован volume под папку " + folder);
}

/**
 * Генерирует уникальное имя файла.
 * @param {string} prefix - Префикс для файла (например, 'report', 'image').
 * @param {string} extension - Расширение файла (например, 'txt', 'jpg').
 * @returns {string} Уникальное имя файла.
 */
function generateFileName() {
  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 8);

  return `${timestamp}_${uniqueId}.json`;
}

module.exports = { saveResultOnDisk, checkFolder };
