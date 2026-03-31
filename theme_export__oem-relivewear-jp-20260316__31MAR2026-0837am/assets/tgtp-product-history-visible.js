async function main() {
  const cookieKey = "product_history";
  /** @type string | undefined */
  const productHistory = Cookies.get(cookieKey);

  const parent = document.querySelector(".product-history");
  let parentSection = null;
  let parent_section_id = '';
  if (parent) {
    /** @type string | undefined */
    parent_section_id = parent.dataset.parentSection;
    if (parent_section_id) {
      parentSection = document.getElementById(parent_section_id);
    }
  }

  if (productHistory) {
    /** @type HTMLUListElement | null */

    if (parent) {
      const shown = parent.dataset.shown;
      const shownParsed = isNaN(parseInt(shown)) ? 16 : parseInt(shown);
      try {
        /** @type Array<{ id: number, handle: string }> */
        const productHistoryParsed = JSON.parse(productHistory);
        /** @type Array<string | null> */
        const responses = await Promise.all(productHistoryParsed.slice(0, shownParsed).map(async (value) => {
          const url = `//${window.location.host}/products/${value.handle}?section_id=tgtp-card-product-hidden`;
          const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "text/html",
            },
          });

          if (!response.ok) {
            return null;
          }

          return await response.text();
        }));

        const parser = new DOMParser();


        responses.map((html) => {
          if (html) {
            const parsedHtml = parser.parseFromString(html, "text/html");
            /** @type HTMLDivElement | null */
            const content = parsedHtml.querySelector(".product-contents");
            if (content) {
              parent.append(...content.children);
            }
          }
        })


        console.log(responses);
        console.log(responses.length);
        if (responses.length) {
          /** @type HTMLElement | null */
          const historyDom = document.querySelector(".product-history");
          console.log(historyDom);
          if (historyDom) {
            // セクションを表示する
            parent.parentElement.classList.add('has-products')
          }
        } else {
          // セクションを非表示にする
          if (parentSection) {
            parentSection.style.display = 'none';
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    // セクションを非表示にする
    if (parentSection) {
      parentSection.style.display = 'none';
    }
  }
}

main();