const UserAuth = require('./middlewares/auth')
const ShoppingService = require('../services/shopping-service')
const CustomerService = require('../services/customer-service')

module.exports = (app) => {
    const service = new ShoppingService()
    const customer = new CustomerService()
        //Create Order
    app.post('/shopping/order', UserAuth, async(req, res, next) => {
            try {
                const { _id } = req.user
                const { txnNumber } = req.body
                const data = await service.PlaceOrder({ _id, txnNumber })
                    // await service.PlaceOrder({ _id, txnNumber })
                    // return res.status(200).json({ "Hello": "order" })
                return res.status(200).json(data)
            } catch (error) {
                next(error)
            }
        })
        //Get Order Details
    app.get('/shopping/orders', UserAuth, async(req, res, next) => {
        try {
            const { data } = await customer.GetShopingDetails(req.user._id)
            return res.status(200).json(data.orders)
        } catch (error) {
            next(error)
        }
    })

    //Get Cart Details
    app.get('/shopping/cart', UserAuth, async(req, res) => {
        try {
            const { data } = await customer.GetShopingDetails(req.user._id)
            return res.status(200).json(data.cart)
        } catch (error) {
            next(error)
        }
    })

}