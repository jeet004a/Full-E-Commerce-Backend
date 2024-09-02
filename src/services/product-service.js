const { ProductRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError, NotFoundError, AppError } = require('../utils/app-errors')

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs) {
        try {
            const productResult = await this.repository.CreateProduct(productInputs)
            return FormateData(productResult)
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

    async ProductByType(productInputs) {
        try {
            const result = await this.repository.productByType(productInputs)
            return FormateData(result)
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

    async GetProducts() {
        try {
            const products = await this.repository.Product()
            let categories = {}
            products.map(({ type }) => {
                categories[type] = type
            })

            return FormateData({ products, categories })
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

    async GetProductDescription(productId) {
        try {
            const data = await this.repository.FindById(productId)
            return FormateData(data)
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

    async GetProductById(productId) {
        try {
            const data = await this.repository.FindById(productId)
            return FormateData(data)
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

}


module.exports = ProductService