import { config } from 'dotenv'
config()

const { PORT, DB_URL, ACCESS_TOKEN_SECRET, FRONTEND_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env

export const Config = {
    PORT,
    DB_URL,
    ACCESS_TOKEN_SECRET,
    FRONTEND_URL,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET
}
