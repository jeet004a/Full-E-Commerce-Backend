const CustomerService = require("../services/customer-service");
const UserAuth = require('./middlewares/auth')
const AppLogs = require('../utils/api-request')

module.exports = (app) => {
    const service = new CustomerService();
    app.post("/customer/signup", async(req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await service.SignUp({ email, password, phone });
            // service.SignUp({ email, password, phone })
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    app.post("/customer/login", async(req, res, next) => {
        try {
            // await AppLogs(req)
            const { email, password } = req.body
            const { data } = await service.SignIn({ email, password })
                // await service.SignIn({ email, password })
            return res.json(data)
        } catch (err) {
            next(err);
        }
    })

    app.post('/customer/address', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { _id } = req.user
            const { street, postalcode, city, country } = req.body
            const { data } = await service.AddNewAddress(_id, { street, postalcode, city, country })

            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('/customer/profile', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { _id } = req.user

            const { data } = await service.GetProfile(_id)
                // await AppLogs(req)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })


    app.get('/customer/shoping-details', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { _id } = req.user
            const { data } = await service.GetShopingDetails(_id)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })


    app.get('/customer/wishlist', UserAuth, AppLogs, async(req, res, next) => {
        try {
            return res.json(req.user)
        } catch (error) {
            next(error)
        }
    })
}