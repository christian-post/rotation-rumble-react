import pkg from '@woocommerce/woocommerce-rest-api';
const WooCommerceRestApi = pkg.default;
import dotenv from "dotenv";

dotenv.config();

const api = new WooCommerceRestApi({
  url: process.env.SHOP_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  version: "wc/v3"
});


export async function testApi() {
  const productKey = "3505";

  api.get(`products/${productKey}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}


export async function testModify(name, cards) {
  const data = {
    description: "I was here :)"
  };

  const productKey = "3505";
  
  api.put(`products/${productKey}`, data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}
