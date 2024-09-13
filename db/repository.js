class Repository {
  constructor({ logger, db, pgp }) {
    this.logger = logger;
    this.db = db;
    this.pgp = pgp;
  }

  async insert({ data, cs }) {
    if (!data.length) throw new Error("Нет данных для вставки");
    const insert = this.pgp.helpers.insert(data, cs.insert);
    await this.db.none(insert);
  }

  async create() {}
}

module.exports = Repository;
