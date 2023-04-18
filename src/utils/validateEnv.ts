import { cleanEnv, port, str } from 'envalid'

//Allows clean .env usage
export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  SESSION_SECRET: str(),
  LDAP_URL: str(),
  LDAP_ADMIN_DN: str(),
  LDAP_BASE_DN: str(),
  LDAP_ADMIN_PASSWORD: str(),
})
