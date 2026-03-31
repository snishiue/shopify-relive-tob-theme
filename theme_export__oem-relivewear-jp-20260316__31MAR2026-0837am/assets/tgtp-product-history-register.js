/**
 * 現在のURLからJSONを取得する
*/
async function getProduct() {
  const productUrl = `//${window.location.host}${window.location.pathname}`;
  const response = await fetch(`${productUrl}.json`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }

  const product = await response.json();

  return product.product;
}

async function main() {
  const product = await getProduct();
  const cookieKey = "product_history";
  /** @type string | undefined */
  const productHistory = Cookies.get(cookieKey);

  /**
   * 指定したIDをクッキーに保存する
   *
   * @param {{ id: number, handle: string }} item
   * @param {{ id: number, handle: string }[]} products
   * @param boolean isFirst
   *
   * @returns void
   */
  function setCookies(item, products = []) {
    Cookies.set(cookieKey, JSON.stringify([item, ...products]), { expires: 7 });
  }

  if (productHistory) {
    /** @type Array<{ id: number, handle: string }> */
    const products = JSON.parse(productHistory);
    if (!products.some((item) => item.id === product.id)) {
      setCookies({ id: product.id, handle: product.handle }, products);
    } else {
      const filteredProducts = products.filter((item) => item.id !== product.id);
      setCookies({ id: product.id, handle: product.handle }, filteredProducts);
    }
  } else {
    setCookies({ id: product.id, handle: product.handle });
  }
}

main();