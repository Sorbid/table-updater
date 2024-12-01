const Repository = require("../repository");
const sql = require("../sql/sqlSettings");

const cs = {};

class SettingRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async select() {
    this.logger.debug("get settings");
    return await super.select({ sql: sql.get });
  }

  async insertLog({ data }) {
    this.logger.debug("insert logs");
    await super.insert({ data, cs });
  }

  async updateDate({ data, cond }) {
    this.logger.debug("update date");
    await super.update({ data, cs, cond });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const tableLog = new pgp.helpers.TableName({
      table: "logs",
      schema: "app_updater",
    });

    const table = new pgp.helpers.TableName({
      table: "upd_tables",
      schema: "app_updater",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "upd_table_id" },
        { name: "is_error", cast: "boolean", prop: "isError" },
        { name: "error_text", prop: "errorText" },
        { name: "upd_date", cast: "date", prop: "updDate" },
      ],
      { table: tableLog }
    );

    cs.update = new pgp.helpers.ColumnSet(
      [
        {
          name: "last_upd_date",
          prop: "lastUpdDate",
          cast: "timestamp",
        },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = SettingRepository;
