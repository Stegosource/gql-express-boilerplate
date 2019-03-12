const router = require('express').Router()

router.get('/', (req, res) => res.sendStatus(200))
router.use('/users', require('./routes/users'))
router.use('/posts', require('./routes/posts'))

module.exports = router
