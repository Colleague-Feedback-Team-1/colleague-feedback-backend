import 'dotenv/config'
import express from 'express'
import { SearchOptions, SearchEntry, Client } from 'ldapts'
import { createSession } from './utils/createSession'
import cors from 'cors'


interface CustomSearchEntry extends SearchEntry {
  dn: string;
}

declare module 'express-session' {
  interface SessionData {
    userData?: CustomSearchEntry;
  }
}
const options = {
  origin: `http://localhost:3000`,
}
const app = express()
app.use(cors(options))
const PORT = 5600

const createNewClient = () => {
  const client = new Client({
    url: 'ldap://localhost:389',
  })
  return client
}

app.use(express.json())

app.post('/auth', createSession(), async (req, res) => {
  const { username, password } = req.body as {
    username: string
    password: string
  }
  const client = createNewClient()
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  const dn = `uid=${username},ou=People,dc=employeesdb,dc=com`

  try {
    await client.bind(dn, password)

    const searchOptions: SearchOptions = {
      scope: 'sub',
      filter: `(&(uid=${username})(objectClass=posixAccount))`,
      attributes: ['cn', 'uid', 'gidNumber', 'description', 'mail'],
    }

    const { searchEntries } = await client.search(
      `uid=${username},ou=People,dc=employeesdb,dc=com`,
      searchOptions
    )

    if (!searchEntries.length) {
      console.error('User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    const userData = searchEntries[0] as unknown as CustomSearchEntry
    console.log('Authentication successful for user:', userData)

    // Store the user data in the request session
    req.session.userData = userData

    res.status(200).json({ userData })
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Authentication failed' })
  } finally {
    await client.unbind()
  }
})

app.listen(PORT, () => {
  console.log(`LDAP server is running on port ${PORT}`)
})
