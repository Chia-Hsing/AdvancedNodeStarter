const buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip')
const keys = require('../../config/keys')
const keygrip = new Keygrip([keys.cookieKey])

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: {
                id: user._id.toString(),
            },
        },
    }

    const session = buffer.from(JSON.stringify(sessionObject)).toString('base64')
    const sig = keygrip.sign('session=' + sessionString)

    return { session, sig }
}
