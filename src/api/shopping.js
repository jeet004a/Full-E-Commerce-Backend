const UserAuth = require('./middlewares/auth')
const ShoppingService = require('../services/shopping-service')

module.exports = (app) => {
    const service = new ShoppingService()

    app.get('/shopping/orders', UserAuth, async(req, res, next) => {
        try {
            await service.GetOrder()
            console.log(req.user)
            return res.status(200).json({ "Hello": "ABC" })
        } catch (error) {
            next(error)
        }
    })

    app.post('/shopping/order', UserAuth, async(req, res, next) => {
        try {
            const { _id } = req.user
            const { txnNumber } = req.body
                // const { data } = await service.PlaceOrder({ _id, txnNumber })
            await service.PlaceOrder({ _id, txnNumber })
            return res.status(200).json({ "Hello": "order" })
        } catch (error) {
            next(error)
        }
    })
}