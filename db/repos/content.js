const Repository = require("../repository");

const cs = {};

class ContentCardsRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.debug("insert ContentCards");
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
      table: "content_cards",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "nm_id", prop: "nmID" },
        { name: "imt_id", prop: "imtID" },
        { name: "nm_uuid", prop: "nmUUID" },
        { name: "subject_id", prop: "subjectID" },
        { name: "vendor_code", prop: "vendorCode" },
        { name: "subject_name", prop: "subjectName" },
        { name: "brand", prop: "brand" },
        { name: "title", prop: "title" },
        { name: "photos", prop: "photos", cast: "jsonb", mod: ":json" },
        { name: "video", prop: "video", def: undefined },
        { name: "dimensions", prop: "dimensions", cast: "jsonb", mod: ":json" },
        {
          name: "characteristics",
          prop: "characteristics",
          cast: "jsonb",
          mod: ":json",
        },
        { name: "sizes", prop: "sizes", cast: "jsonb", mod: ":json" },
        {
          name: "tags",
          prop: "tags",
          cast: "jsonb",
          mod: ":json",
          def: undefined,
        },
        { name: "created_at", prop: "createdAt", cast: "date" },
        { name: "updated_at", prop: "updatedAt", cast: "date" },
        { name: "date_report", prop: "dateReport", cast: "date" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = ContentCardsRepository;
