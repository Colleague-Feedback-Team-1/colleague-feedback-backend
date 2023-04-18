import 'dotenv/config'
import mongoose from 'mongoose';
import { Client, SearchOptions } from 'ldapts';
import app from "./app"
import env from "./utils/validateEnv"

const port = env.PORT

const UserSchema = new mongoose.Schema({
  uid: String,
  displayName: String,
  uidNumber: Number,
  gidNumber: Number,
  mail: String,
  description: String,
});

const User = mongoose.model('User', UserSchema);

//This function is to be used when the LDAP directroy has been populated with new users
async function importUsersFromLDAPToMongoDB() {
  // Connect to MongoDB
  await mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('Mongoose connected')
    app.listen(port, () => console.log(`Server started at ${port}`))
  })
  .catch(console.error)

  // Connect to LDAP server
  const client = new Client({
    url: 'ldap://localhost:389',
  });

  await client.bind(env.LDAP_ADMIN_DN, env.LDAP_ADMIN_PASSWORD);

  // Search for all users in the LDAP server
  const searchOptions: SearchOptions = {
    scope: 'sub',
    filter: '(objectClass=inetOrgPerson)',
  };

  const { searchEntries } = await client.search('ou=People,dc=employeesdb,dc=com', searchOptions);

  // Insert users into MongoDB
  for (const entry of searchEntries) {
    const userData = {
      uid: entry.uid,
      displayName: entry.displayName,
      uidNumber: entry.uidNumber,
      gidNumber: entry.gidNumber,
      mail: entry.mail,
      description: entry.description,
    };

    await User.create(userData);
  }

  console.log(`Imported ${searchEntries.length} users from LDAP to MongoDB.`);

  await client.unbind();
  await mongoose.connection.close();
}

importUsersFromLDAPToMongoDB();
