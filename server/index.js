require('dotenv').config()

const express = require('express')
const crypto = require('crypto')

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN

const smsKey = process.env.SMS_SECRET_KEY

const app = express()
app.use(express.json());

app.post('/sendOTP',(req, res) => {
    const phone = req.body.phone
    const otp = Math.floor(100000 + Math.random()*9000)
    const ttl = 2*60*1000
    const expires = Date.now() + ttl
    const data = `${phone}.${otp}.${expires}`
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')
    const fullHash = `${hash}.${expires}`

    client.messages.create({
        body: `Your on time Login Password for CFM is ${otp}`,
        from: +12676425662,
        to: phone
    }).then((message)=> console.log(message))
})
app.listen(4000)