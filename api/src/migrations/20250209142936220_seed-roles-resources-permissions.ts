import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import rolesResourcesPermissions from "./data/roles-resources-permissions.json";
import validationTables from "./data/validation-tables.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  async function seed(
    role: string,
    resourcePermissions: { [key: string]: string[] },
  ) {
    for (const resource in resourcePermissions) {
      for (const permission of resourcePermissions[resource]) {
        pgm.sql(`
        WITH rrp_ids AS (
          SELECT 
            role.role_id,
            resource.resource_id,
            permission.permission_id
          FROM 
            role,
            resource,
            permission
          WHERE 
            role.name = '${role}' AND
            resource.name = '${resource}' AND
            permission.name = '${permission}'
        )
        INSERT INTO role_resource_permission 
          (role_id, resource_id, permission_id)
        SELECT 
          role_id, 
          resource_id, 
          permission_id 
        FROM 
          rrp_ids;
      `);
      }
    }
  }

  const broadcasterPerms = rolesResourcesPermissions.broadcaster;
  await seed(validationTables.roles["3"], broadcasterPerms);

  const listenerPerms = rolesResourcesPermissions.listener;
  await seed(validationTables.roles["2"], listenerPerms);

  const superadminPerms = rolesResourcesPermissions.superadmin;
  await seed(validationTables.roles["1"], superadminPerms);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE role_resource_permission RESTART IDENTITY CASCADE");
}
