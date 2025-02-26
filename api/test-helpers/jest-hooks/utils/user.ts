import { dbConnection } from "../../../src/config/postgres";
import { authnService } from "../../../src/services/authn";

type User = {
  userId?: number;
  roleName: string;
  username: string;
  password: string;
  passwordHash?: string;
  email: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
};

let superadminUser: User = {
  roleName: "superadmin",
  username: process.env.HAL_USERNAME || "",
  password: process.env.HAL_PASSWORD || "",
  email: process.env.HAL_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
};
let broadcasterUser: User = {
  roleName: "broadcaster",
  username: process.env.ANDREYPONOMAREV_USERNAME || "",
  password: process.env.ANDREYPONOMAREV_PASSWORD || "",
  email: process.env.ANDREYPONOMAREV_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
};
let listenerUser: User = {
  roleName: "listener",
  username: process.env.JOHNDOE_USERNAME || "",
  password: process.env.JOHNDOE_PASSWORD || "",
  email: process.env.JOHNDOE_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
};

async function seed({
  username,
  roleName,
  email,
  password,
  isEmailConfirmed,
  isDeleted,
}: User): Promise<{ userId: number; passwordHash: string }> {
  const pool = await dbConnection.open();

  const selectRoleIdRes = await pool.query(
    `SELECT role_id FROM role WHERE name = '${roleName}'`,
  );

  const passwordHash = await authnService.hashPassword(password);

  const sql = `
      INSERT INTO appuser (
        role_id, 
        username, 
        password_hash, 
        email, 
        is_email_confirmed, 
        is_deleted 
      ) 
      VALUES (
        ${selectRoleIdRes.rows[0].role_id}, 
        '${username}', 
        '${passwordHash}', 
        '${email}', 
        ${isEmailConfirmed}, 
        ${isDeleted} 
      )
      RETURNING appuser_id
  `;

  const insertUserRes = await pool.query<{ appuser_id: number }>(sql);

  return { userId: insertUserRes.rows[0].appuser_id, passwordHash };
}

const createUsers = async () => {
  const superadmin = await seed(superadminUser);
  const broadcaster = await seed(broadcasterUser);
  const listener = await seed(listenerUser);

  superadminUser = {
    ...superadminUser,
    userId: superadmin.userId,
    passwordHash: superadmin.passwordHash,
  };
  broadcasterUser = {
    ...broadcasterUser,
    userId: broadcaster.userId,
    passwordHash: broadcaster.passwordHash,
  };
  listenerUser = {
    ...listenerUser,
    userId: listener.userId,
    passwordHash: listener.passwordHash,
  };
};

// Now you can import user for the specific test (integration or e2e) at the top of the test file e.g. import { defaultUser: { roleNameSuperadmin } } from "..." and user the properties of the imported user in a test e.g.
//  const response = await request(app)
//    .put(`/users/${user.username}`)
//    .send({ email: user.email, password: "a_password" })
export { superadminUser, broadcasterUser, listenerUser, createUsers };
