function setCookie(name, value, options = {}) {
  if (value === null) {
    value = '';
    options.expires = -1;
  }
  let expires = '';
  if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
    let date;
    if (typeof options.expires === 'number') {
      date = new Date();
      date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
    } else {
      date = options.expires;
    }
    expires = '; expires=' + date.toUTCString();
  }
  const path = options.path ? '; path=' + options.path : '';
  const domain = options.domain ? '; domain=' + options.domain : '';
  const secure = options.secure ? '; secure' : '';
  document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
}

function getCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

var Shopify = {};
Shopify.Products = (function () {

  var config = {
    howManyToShow: 3,
    howManyToStoreInMemory: 10,
    wrapperId: 'recently-viewed-products',
    templateId: 'recently-viewed-product-template',
    onComplete: null
  };

  var productHandleQueue = [];
  var wrapper = null;
  var template = null;
  var shown = 0;

  var cookie = {
    configuration: {
      expires: 90,
      path: '/',
      domain: window.location.hostname
    },
    name: 'shopify_recently_viewed',
    write: function (recentlyViewed) {
      setCookie(this.name, recentlyViewed.join(' '), this.configuration);
    },
    read: function () {
      var recentlyViewed = [];
      var cookieValue = getCookie(this.name);
      if (cookieValue !== null) {
        recentlyViewed = cookieValue.split(' ');
      }
      return recentlyViewed;
    },
    destroy: function () {
      eraseCookie(this.name);
    },
    remove: function (productHandle) {
      var recentlyViewed = this.read();
      var position = recentlyViewed.indexOf(productHandle);
      if (position !== -1) {
        recentlyViewed.splice(position, 1);
        this.write(recentlyViewed);
      }
    }
  };

  var finalize = function () {
    wrapper.style.display = 'block';
    // If we have a callback.
    if (config.onComplete) {
      try { config.onComplete() } catch (error) { }
    }
  };

  var moveAlong = function () {
    if (productHandleQueue.length && shown < config.howManyToShow) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var product = JSON.parse(xhr.responseText);
            var productHtml = template.innerHTML.replace(/{{\s*[\w\.]+\s*}}/g, function (match) {
              var key = match.replace(/[{}]+/g, '').trim();
              return product[key] || '';
            });
            wrapper.innerHTML += productHtml;
            productHandleQueue.shift();
            shown++;
            moveAlong();
          } else {
            cookie.remove(productHandleQueue[0]);
            productHandleQueue.shift();
            moveAlong();
          }
        }
      };
      xhr.open('GET', '/products/' + productHandleQueue[0] + '.js', true);
      xhr.send();
    }
    else {
      finalize();
    }
  };

  return {

    resizeImage: function (src, size) {
      if (size == null) {
        return src;
      }

      if (size == 'master') {
        return src.replace(/http(s)?:/, "");
      }

      var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);

      if (match != null) {
        var prefix = src.split(match[0]);
        var suffix = match[0];

        return (prefix[0] + "_" + size + suffix).replace(/http(s)?:/, "")
      } else {
        return null;
      }
    },

    showRecentlyViewed: function (params) {

      var params = params || {};

      // Update defaults.
      Object.assign(config, params);

      // Read cookie.
      productHandleQueue = cookie.read();

      // Template and element where to insert.
      template = document.getElementById(config.templateId);
      wrapper = document.getElementById(config.wrapperId);

      // How many products to show.
      config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

      // If we have any to show.
      if (config.howManyToShow && template && wrapper) {
        // Getting each product with an Ajax call and rendering it on the page.
        moveAlong();
      }

    },

    getConfig: function () {
      return config;
    },

    clearList: function () {
      cookie.destroy();
    },

    recordRecentlyViewed: function (params) {

      var params = params || {};

      // Update defaults.
      Object.assign(config, params);

      // Read cookie.
      var recentlyViewed = cookie.read();

      // If we are on a product page.
      if (window.location.pathname.indexOf('/products/') !== -1) {

        // What is the product handle on this page.
        var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
        // In what position is that product in memory.
        var position = recentlyViewed.indexOf(productHandle);
        // If not in memory.
        if (position === -1) {
          // Add product at the start of the list.
          recentlyViewed.unshift(productHandle);
          // Only keep what we need.
          recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
        }
        else {
          // Remove the product and place it at start of list.
          recentlyViewed.splice(position, 1);
          recentlyViewed.unshift(productHandle);
        }

        // Update cookie.
        cookie.write(recentlyViewed);

      }

    }

  };

})();
