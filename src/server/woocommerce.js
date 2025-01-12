import pkg from '@woocommerce/woocommerce-rest-api';
const WooCommerceRestApi = pkg.default;
import dotenv from "dotenv";
import { sanitize } from './utils.js';

dotenv.config();

const api = new WooCommerceRestApi({
  url: process.env.SHOP_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  version: "wc/v3"
});


async function getProductList() {
  api.get("products", { per_page: 50 })
    .then((response) => {
      response.data.forEach(product => {
        console.log(`id: ${product.id} name: "${product.name}" sku: ${product.sku} visibility: ${product.catalog_visibility}`);
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


export async function testOrderDeck(deckname, captain, cards, image) {
  // sanitize req data
  const data = {
    name: `Custom Deck (${sanitize(deckname)})`,
    description: `This is a custom deck created by the user.\n` +
      ` It is captained by ${captain} and contains the following ${cards.length} cards:\n ${cards.join("\n")}`,
    slug: "custom-deck",
    status: "publish",
    catalog_visibility: "catalog",
    meta_data: [
      {
        key: "card_list",
        value: cards.map(sanitize).join("\n")
      },
      {
        key: "captain",
        value: sanitize(captain)
      }
    ],
    images: [
      {
        src: image
      }
    ]
  };

  // product key of the original custom deck
  const originalProductKey = process.env.CUSTOM_DECK_PRODUCT_KEY;
  if (originalProductKey === undefined) {
    console.error("CUSTOM_DECK_PRODUCT_KEY is not set in the environment.");
    return { 
      status: 500,
      message: "Server error: CUSTOM_DECK_PRODUCT_KEY is not set." 
    };
  }

  let response;

  try {
    response = await api.post(`products/${originalProductKey}/duplicate`);
  } catch (error) {
    console.log(error.response?.data || "Error occurred");
    return error.response || { 
      code: "unknown",
      message: "Unknown error",
      data: error.response?.data || { status: 500 }
    };
  }

  try {
    // change the metadata and return the product
    console.log("trying to put data to duplicate")
    const newProductKey = response.data.id;
    response = await api.put(`products/${newProductKey}`, data);
  } catch (error) {
    console.log(error.response?.data || "Error occurred");
    return error.response || { 
      code: "unknown",
      message: "Unknown error",
      data: error.response?.data || { status: 500 }
    };
  }

  // schedule a deletion of the deck after 30 minutes
  if (response.status == 200) {
    const productId = response.data.id;
    const minutesDelay = 10;  // delete order after x minutes

    console.log(`product scheduled for deletion in ${minutesDelay} minutes.`);

    setTimeout(()=> {
      deleteFinally(productId);
      // TODO: remove from cart?
    }, minutesDelay * 60 * 1000);
  }

  return response;
}


function modifyProduct(productId, data) {
  api.put(`products/${productId}`, data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response?.data || error);
    });
}


function deleteFinally(productId) {
  api.delete(`products/${productId}`, {
    force: true
  })
    .then((response) => {
      console.log(`Deleted product with ID ${response.data.id}`);
    })
    .catch((error) => {
      console.log(error);
    });
}



// let decklist = [
//   "Alchemy Book",
//   "Aridam",
//   "Berta",
//   "Bleeding",
//   "Banshee",
//   "Dr. Oops",
//   "Devil´s Deal",
//   "Eelzebub",
//   "El Torro",
//   "Evil Cauldron",
// ];

// testOrderDeck("Test", "Mett", decklist).then(res => {
//   console.log("test order:", res.statusText);
// })


