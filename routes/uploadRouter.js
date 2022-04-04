const AWS = require('aws-sdk')
const keys = require('../config/keys')
const uuid = require('uuid')
const requireLogin = require('../middlewares/requireLogin')

const s3 = AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
})

mosule.exports = (app) => {
    app.get('/api/upload', requireLogin, async (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`

        s3.getSignedUrl(
            'putObject',
            {
                // 自己創建的 aws s3 的 bucket 名稱
                Bucket: 'my-blog-bucket-prac',
                // 上傳檔案的類型
                ContentType: 'jpeg',
                // bucket 中 folder 的層級。folder/file name
                key: key,
            },
            // 返回的 url 用來上傳的檔案
            (err, url) => res.send({ key, url })
        )
    })
}
