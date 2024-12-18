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


async function getProductList() {
  api.get("products")
    .then((response) => {
      response.data.forEach(product => {
        console.log(`id: ${product.id} name: "${product.name}" sku: ${product.sku}`);
      });
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}


export async function getProduct(productKey) {
  api.get(`products/${productKey}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}



export async function getProductBySku(sku) {
  try {
    const response = await api.get("products", {
      sku: sku
    });

    if (response.data.length > 0) {
      console.log(`Product with SKU ${sku} exists.`, response.data);
      return response.data[0]; // Return the product if found
    } else {
      console.log(`Product with SKU ${sku} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error checking SKU:", error.response?.data || error.message);
    return null;
  }
}




async function publishProduct(productKey) {
  const data = {
    status: "publish",
    catalog_visibility: "hidden"
  };

  api.put(`products/${productKey}`, data)
    .then((response) => {
      // console.log(response.data);
      console.log(`product ${productKey} has been published.`)
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}


export async function testOrderDeck(deckname, cards) {
  const data = {
    name: `Custom Deck (${deckname})`,
    description: "Order a custom deck from the deck builder.",
    slug: "custom-deck",
    status: "publish",
    catalog_visibility: "hidden",
    meta_data: [
      {
        key: "card_list",
        value: cards.join("\n")
      }
    ]
  };

  // product key of the original custom deck
  const originalProductKey = "3523";
  let response;

  try {
    response = await api.post(`products/${originalProductKey}/duplicate`);
  } catch (error) {
    console.log(error.response?.data || "Error occurred");
    return error.response?.data || { message: "Unknown error" };
  }

  try {
    // change the metadata and return the product
    console.log("trying to put data to duplicate")
    const newProductKey = response.data.id;
    response = await api.put(`products/${newProductKey}`, data);
  } catch (error) {
    console.log(error.response?.data || "Error occurred");
    return error.response?.data || { message: "Unknown error" };
  }

  return response.data;
}



// getProductList();

// testOrderDeck("Test", ["foo", "bar"]);

// getProduct(2958)
// getProductBySku(6000)
// getProduct(3515)
// publishProduct(3515);

