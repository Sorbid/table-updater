class Repository {
  constructor({ logger, db, pgp }) {
    this.logger = logger;
    this.db = db;
    this.pgp = pgp;
  }

  async insert({ data, cs }) {
    this.logger.debug(
      `Выполнение insert запроса: ${JSON.stringify(data)}; таблица: ${
        cs.insert.table
      }`
    );
    const insert = this.createInsertQuery({ data, cs });
    try {
      await this.db.none(insert);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  async runRawQuery({ sql }) {
    this.logger.debug(`Выполнение сырого insert запроса: ${sql}`);
    try {
      await this.db.none(sql);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  createInsertQuery({ data, cs }) {
    return this.pgp.helpers.insert(data, cs.insert);
  }

  createUpdateQuery({ data, cs }) {
    this.logger.debug(
      `Выполнение множественного update запроса: ${JSON.stringify(
        data
      )}; таблица: ${cs.update.table}`
    );
    const where = " where v.id = t.id";
    return this.pgp.helpers.update(data, cs.update) + where;
  }

  createUpsertQuery({ data, cs }) {
    this.logger.debug(
      `Выполнение множественного upsert запроса: ${JSON.stringify(
        data
      )}; таблица: ${cs.insert.table}`
    );
    return this.pgp.helpers.insert(data, cs.insert) + cs.onConflict;
  }

  async tx() {}

  async update({ data, cs, cond }) {
    this.logger.debug(
      `Выполнение update запроса: ${JSON.stringify(data)}; таблица: ${
        cs.update.table
      }; условие: ${cond}`
    );
    const where = this.pgp.as.format(
      " WHERE " + cond.map((item) => `${item} = $\{${item}\}`).join(" "),
      data
    );
    const update = this.pgp.helpers.update(data, cs.update) + where;
    try {
      await this.db.none(update);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  async upsert({ data, cs, cond }) {
    this.logger.debug(
      `Выполнение upsert запроса: ${JSON.stringify(data)}; таблица: ${
        cs.insert.table
      }; условие: ${cond}`
    );
    const upsert = createUpsertQuery({ data, cs });
    try {
      await this.db.none(upsert);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  async updateMulti({ data, cs }) {
    this.logger.debug(
      `Выполнение множественного update запроса: ${JSON.stringify(
        data
      )}; таблица: ${cs.update.table}`
    );
    const where = " where v.id = t.id";
    const update = this.pgp.helpers.update(data, cs.update) + where;
    try {
      await this.db.none(update);
    } catch (err) {
      this.logger.error("Произошла ошибка в бд: " + err);
      throw err;
    }
  }

  async select({ sql }) {
    this.logger.debug(`Выполнение ручного запроса: ${sql}`);
    return await this.db.any(sql);
  }
}

module.exports = Repository;
