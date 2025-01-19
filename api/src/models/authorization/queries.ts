import { dbConnection } from "../../config/postgres";

type CreatePermissionsDBResponse = { permission_id: number; name: string };
type CreateResourceDBResponse = { resource_id: number; name: string };
type CreateRoleDBResponse = { role_id: number; name: string };

export const authzRepo = {
  createRole: async function (name: string) {
    const sql = "INSERT INTO	role (name) VALUES ($1) RETURNING *";
    const values = [name];
    const pool = await dbConnection.open();
    const res = await pool.query<CreateRoleDBResponse[]>(sql, values);
    return res.rows;
  },

  createResource: async function (name: string) {
    const sql = "INSERT INTO resource (name) VALUES ($1) RETURNING *";
    const values = [name];
    const pool = await dbConnection.open();
    const res = await pool.query<CreateResourceDBResponse>(sql, values);
    return res.rows;
  },

  createPermission: async function (name: string) {
    const sql = "INSERT INTO permission (name) VALUES ($1) RETURNING *";
    const values = [name];
    const pool = await dbConnection.open();
    const res = await pool.query<CreatePermissionsDBResponse>(sql, values);
    return res.rows;
  },

  assignRoleResourcePermission: async function ({
    role,
    resource,
    permission,
  }: {
    role: string;
    resource: string;
    permission: string;
  }) {
    const sql =
      "WITH rrp_ids AS (\
      SELECT \
        role.role_id, \
        resource.resource_id, \
        permission.permission_id \
      FROM \
        role, \
        resource, \
        permission \
      WHERE \
        role.name = $1 AND \
        resource.name = $2 AND \
        permission.name = $3\
    ) \
    INSERT INTO \
      role_resource_permission \
    SELECT \
      role_id, \
      resource_id, \
      permission_id \
    FROM \
      rrp_ids";
    const values = [role, resource, permission];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },
};
