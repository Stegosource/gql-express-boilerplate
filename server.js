require('dotenv').config()
const fs = require('fs')
const app = require('./src/app')
const gqlServer = require('./src/gql')

const httpPort = process.env.HTTP_PORT || 3000
const httpsPort = process.env.HTTPS_PORT || 3443
const gqlPort = process.env.GQL_PORT || 4000

const httpsOptions = {
  key: fs.readFileSync('./certs/local.key'),
  cert: fs.readFileSync('./certs/local.crt'),
  requestCert: false,
  rejectUnauthorized: false
}

const httpServer = require('http').createServer(app)
const httpsServer = require('https').createServer(httpsOptions, app)

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running at http://localhost:${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server running at https://localhost:${httpsPort}`)
})

module.exports = httpServer

gqlServer.start(() => console.log(`GraphQL server running at http://localhost:${gqlPort}`))
gqlServer.express.get('/test', (req, res, next) => {
  res.send('ok')
})

// server.express.use(cookieParser());

// Decode JWT from cookies in each request
// server.express.use((req, res, next) => {
//   const { token } = req.cookies;
//   if (token) {
//     const { userId } = jwt.verify(token, process.env.APP_SECRET);
//     req.userId = userId;
//   }
//   next();
// });

// Populate user on each request
// server.express.use(async (req, res, next) => {
//   if (!req.userId) return next();
//   const user = await db.query.user(
//     {
//       where: { id: req.userId }
//     },
//     "{ id, permissions, email, name }"
//   );
//   req.user = user;
//   next();
// });

// server.start(
//   {
//     cors: {
//       credentials: true,
//       origin: process.env.FRONTEND_URL
//     }
//   },
//   deets => {
//     console.log(`Server is running on http://localhost:${deets.port}`);
//   }
// );
