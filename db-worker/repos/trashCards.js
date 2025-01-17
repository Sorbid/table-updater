const Repository = require("./repository");

const cs = {};

class TrashCardsRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert TrashCards");
    await super.insert({ data, cs });
  }

  addQuery({ data }) {
    this.queries.push(super.createInsertQuery({ data, cs }));
  }

  async runQueries() {
    await Promise.all(this.queries.map((sql) => super.runRawQuery({ sql })));
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "trash_cards",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "nm_id", prop: "nmId" },
        { name: "vendor_code", prop: "vendorCode" },
        { name: "subject_id", prop: "subjectId" },
        { name: "subject_name", prop: "subjectName" },
        { name: "photos", prop: "photos", cast: "jsonb", mod: ":json" },
        { name: "video", prop: "video" },
        { name: "sizes", prop: "sizes", cast: "jsonb", mod: ":json" },
        { name: "dimensions", prop: "dimensions", cast: "jsonb", mod: ":json" },
        {
          name: "characteristics",
          prop: "characteristics",
          cast: "jsonb",
          mod: ":json",
        },
        { name: "created_at", prop: "createdAt", cast: "timestamp" },
        { name: "trashed_at", prop: "trashedAt", cast: "timestamp" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = TrashCardsRepository;
