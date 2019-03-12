// const os = require('os')
// const fs = require('fs')
const nodemailer = require('nodemailer')

const isDev = process.env.NODE_ENV !== 'production'
const domain = 'example.com'

const config = {
  disabled: false, // Disable all emails being sent
  filtered: false, // Only allow emails to @domain
  prefix: isDev ? '[DEV] ' : '',
  mtxUrl: isDev ? 'http://localhost:8080' : 'https://alpha.matryx.ai',
  smtp: {
    host: isDev ? 'smtp.ethereal.email' : 'TODO'
  },
  mail: {
    defaultFrom: `noreply@${domain}`
  }
}

const Transporter = (function() {
  let instance

  async function createInstance() {
    if (isDev) {
      // Generate test SMTP service account from ethereal.email
      const account = await nodemailer.createTestAccount()
      user = account.user
      pass = account.pass
    } else {
      // TODO
    }

    return nodemailer.createTransport({
      host: config.smtp.host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user, //ova.barton@ethereal.email
        pass
      }
    })
  }

  return {
    getInstance: async () => {
      if (!instance) {
        instance = await createInstance()
      }
      return instance
    }
  }
})()

async function sendMail({ from, to, subject, text, html }) {
  if (config.disabled) return
  if (!to || !subject || !(text + html)) return
  if (config.filtered && !to.endsWith(domain)) return

  from = from || config.mail.defaultFrom
  subject = config.prefix + subject

  const transporter = await Transporter.getInstance()

  // send mail with defined transport object
  let info = await transporter.sendMail({ from, to, subject, text, html })

  // Log to the console
  if (isDev) {
    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }

  // Save to the file system (??)
  // if (isDev) {
  //   // const tmpDir = os.tmpdir()
  //   const json = JSON.stringify({ to, subject, text, html }, null, 2)
  //   try {
  //     fs.writeFileSync(tmpDir + '/last-mail-for-' + to + '-' + type + '.json', json, 'utf8')
  //   } catch (err) {
  //     console.log('Could not save mail content to disk', err)
  //   }
  // }
}

const getTemplate = {
  example() {
    return {
      subject: `Subject`,
      html: `<p>contents</p>`
    }
  }
}

exports.example = function({ to }) {
  let { subject, html } = getTemplate.example()
  return sendMail({ to, subject, html })
}
