import { cleanEnv, port, str } from 'envalid'

//Allows clean .env usage
export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  SESSION_SECRET: str(),
})
