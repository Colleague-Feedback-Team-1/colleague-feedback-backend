import app from "./app"
import env from "./utils/validateEnv"
import mongoose from 'mongoose'

const port = env.PORT

//Connecting to database and starting server 
mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('Mongoose connected')
    app.listen(port, () => console.log(`Server started at ${port}`))
  })
  .catch(console.error)
