import { connectDB } from "../../config/postgres";

type CreatePermissionsDBResponse = { permission_id: number; name: string };
type CreateResourceDBResponse = { resource_id: number; name: string };
type CreateRoleDBResponse = { role_id: number; name: string };

async function createRole(name: string) {
  const sql = "INSERT INTO	role (name) VALUES ($1) RETURNING *";
  const values = [name];
  const pool = await connectDB();
  const res = await pool.query<CreateRoleDBResponse[]>(sql, values);
  return res.rows;
}

async function createResource(name: string) {
  const sql = "INSERT INTO resource (name) VALUES ($1) RETURNING *";
  const values = [name];
  const pool = await connectDB();
  const res = await pool.query<CreateResourceDBResponse>(sql, values);
  return res.rows;
}

async function createPermission(name: string) {
  const sql = "INSERT INTO permission (name) VALUES ($1) RETURNING *";
  const values = [name];
  const pool = await connectDB();
  const res = await pool.query<CreatePermissionsDBResponse>(sql, values);
  return res.rows;
}

async function assignRoleResourcePermission({
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
  const pool = await connectDB();
  await pool.query(sql, values);
}
