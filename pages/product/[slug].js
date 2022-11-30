import React, { useState } from "react";
import { urlFor, client } from "../../lib/client";

import {
  AiFillStar,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;
  
 const {qty, incressQty, decressQty, onAdd, setShowCart} = useStateContext()

  const [index, setIndex] = useState(0);
   
  const handelBuyNow = ()=> {
    onAdd(product, qty);
    setShowCart(true)
  }

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-containe">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
              alt=""
            />
          </div>
          <div className="small-images-container">
            {image.map((item, i) => (
              <img
                src={urlFor(item)}
                alt="product photos"
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(12)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price"><span style={{color : '#d5d5d5'}}>EGP</span> {price}</p>
          <div>
            <h3>Quantity:</h3>
            <p className="quantity-desc" style={{ width: "fit-content" }}>
              <span className="minus" onClick={decressQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" >
                {qty}
              </span>
              <span className="plus" onClick={incressQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button type="button" onClick={()=> onAdd(product, qty)} className="add-to-cart">
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handelBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* you  may also like */}
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((prod, index) => (
              <Product key={prod._id ||  index} prod={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

export const getStaticPaths = async () => {
  const productsQuary = `*[_type == "product"] {
        slug {
            current
        }
    }`;

  const products = await client.fetch(productsQuary);

  const paths = products.map((prod) => ({
    params: {
      slug: prod.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuary = '*[_type == "product"]';
  const product = await client.fetch(query);
  const products = await client.fetch(productsQuary);

  return {
    props: { products, product },
  };
};
