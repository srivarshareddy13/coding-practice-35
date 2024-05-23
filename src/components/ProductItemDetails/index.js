// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import BsPlusSquare from 'react-icons/bs'
import BsDashSquare from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import {Redirect} from 'react-router-dom'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiConstants[0].initial,
    productItem: [],
    similarItems: [],
    quantity: 1,
  }

  componentDidMount() {
    getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {activeId} = this.props
    const token = Cookies.get(jwt_token)

    const apiUrl = `https://apis.ccbp.in/products/:${activeId}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = data.products.map(each => ({
        id: each.id,
        title: each.title,
        imageUrl: each.image_url,
        brand: each.brand,
        description: each.description,
        price: each.price,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      const updatedData = data.similar_products.map(each => ({
        id: each.id,
        title: each.title,
        imageUrl: each.image_url,
        brand: each.brand,
        style: each.style,
        description: each.description,
        price: each.price,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      this.setState({
        productItem: formattedData,
        similarItems: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickButton = () => <Redirect to="/products" />

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickButton}>
        Continue Shopping
      </button>
    </div>
  )

  onClickDash = () => {
    if (quantity > 0) {
      this.setState(prevState => prevState.quantity - 1)
    }
  }

  onClickPlus = () => this.setState(prevState => prevState.quantity + 1)

  renderSuccess = () => {
    const {productItem, similarItems} = this.state
    const {
      imageUrl,
      title,
      price,
      brand,
      description,
      rating,
      availability,
      totalReviews,
      quantity,
    } = productItem

    return (
      <>
        <div>
          <img src={imageUrl} alt={title} />
          <h1>{title}</h1>
          <p>Rs {price}</p>
          <button type="button">
            {rating}
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </button>
          <p>{totalReviews}</p>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <button onClick={this.onClickDash}><BsDashSquare /></button>
          <p>{quantity}</p>
          <button onClick={this.onClickPlus}><BsPlusSquare /></button>
          <button>ADD TO CART</button>
        </div>
        <h1>Similar Products</h1>
        <ul>
          {similarItems.map(each => (
            <SimilarProductItem key={each.id} details={each} />
          ))}
        </ul>
      </>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default ProductItemDetails
