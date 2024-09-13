class Repository {
  constructor({ logger, db, pgp }) {
    this.logger = logger;
    this.db = db;
    this.pgp = pgp;
  }

  async insert({ data, cs }) {
    if (!data.length) throw new Error("Нет данных для вставки");
    const insert = this.pgp.helpers.insert(data, cs.insert);
    try {
      await this.db.none(insert);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  async create() {}
}

module.exports = Repository;
