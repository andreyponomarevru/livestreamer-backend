import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

const setting = {
  name: "send_email_notifications_for_nearest_scheduled_broadcast",
  isConstrained: true,
  dataType: "boolean",
};
const allowedValues = [false, true];

export async function up(pgm: MigrationBuilder): Promise<void> {
  const settingIdRes = await pgm.db.query(`
    INSERT INTO setting (name, is_constrained, data_type)
    VALUES ('${setting.name}', ${setting.isConstrained}, '${setting.dataType}')
    RETURNING setting_id
  `);
  const settingId = settingIdRes.rows[0].setting_id;

  const allowed = allowedValues
    .map((val) => `( ${settingId}, ${val} )`)
    .join(", ");
  await pgm.db.query(
    `INSERT INTO allowed_setting_value (setting_id, value)	VALUES ${allowed}`,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    "TRUNCATE TABLE allowed_setting_value, setting RESTART IDENTITY CASCADE",
  );
}
