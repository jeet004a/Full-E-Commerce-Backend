const { CustomerRepository, ProductRepository } = require("../database");
const { FormateData, GenerateSalt, GeneratePassword, GenerateSignature, validatePassword } = require('../utils')

class CustomerService {
    constructor() {
            this.repository = new CustomerRepository();
        }
        //This is sign in service
    async SignUp(userInputs) {
        try {
            const { email, password, phone } = userInputs;
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(password, salt)
            console.log(userPassword)

            const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone, salt })
            const token = await GenerateSignature({ email: email, _id: existingCustomer._id })


            return FormateData({ id: existingCustomer._id, token })

            // return FormateData({ 'User Email': userPassword })

        } catch (err) {
            throw new APIError('Data Not found', err)
        }

    }

    async SignIn(userInputs) {
        try {
            const { email, password } = userInputs

            const existingCustomer = await this.repository.FindCustomer({ email })

            if (existingCustomer) {
                const validPassword = await validatePassword(password, existingCustomer.password, existingCustomer.salt)
                if (validatePassword) {
                    const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id })
                    return FormateData({ _id: existingCustomer._id, token })
                }
            }

        } catch (error) {
            throw new APIError("Error while loginin from customer-service", error);

        }
    }

    async AddNewAddress(_id, userInputs) {

        try {
            const { street, postalcode, city, country } = userInputs

            const addressResult = await this.repository.CreateAddress(_id, { street, postalcode, city, country })

            return FormateData(addressResult)
        } catch (error) {
            throw new APIError('Data Not Found', error)
        }
    }


    async GetProfile(_id) {
        try {
            const existingCustomer = await this.repository.FindCustomerById(_id)
            return FormateData(existingCustomer)
        } catch (error) {
            throw new APIError('Data Not Found', error)
        }
    }

    async GetShopingDetails(_id) {
        try {
            const existingCustomer = await this.repository.FindCustomerById(_id)
            if (existingCustomer) {
                return FormateData(existingCustomer)
            }
            return FormateData({ msg: 'Error' })
        } catch (error) {
            throw new APIError('Data Not Found', error);

        }
    }


    async AddToWishList(customerId, product) {
        const userdata = await this.repository.AddWishlistItem(customerId, product)
            // await this.repository.AddWishlistItem(customerId, product)
            // console.log(userdata)
        return FormateData(userdata)
    }

    async deleteToWishList(customerId, product) {
        const userdata = await this.repository.deleteToWishListItem(customerId, product)
        return FormateData(userdata)
    }

    async addToCart(userId, product, qty) {
        const data = await this.repository.addToCartItem(userId, product, qty)
        return FormateData(data)
    }

    async deleteToCart(customerId, productId) {
        const userData = await this.repository.deleteToCartItem(customerId, productId)
        return FormateData(userData)

    }

}


module.exports = CustomerService;