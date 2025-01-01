import mongoose from 'mongoose'
import { Config } from './index.js'

const db = async () => {
    const url = Config.DB_URL
    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        })
        const connection = mongoose.connection
        console.log('DB connection established')
        return connection
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default db
