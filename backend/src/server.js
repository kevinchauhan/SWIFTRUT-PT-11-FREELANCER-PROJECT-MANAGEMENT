import app from './app.js'
import { Config } from './config/index.js'

const startServer = async () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(error.message)
        setTimeout(() => {
            process.exit(1)
        }, 1000)
    }
}
startServer()
