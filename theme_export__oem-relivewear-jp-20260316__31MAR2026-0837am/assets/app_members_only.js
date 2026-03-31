const tgApp = {}

// URLからドメイン部分のみ取り出す関数
tgApp.getDomain = function(url) {
  let domain;
  if (!url) {
    return '';
  }
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  domain = domain.split('?')[0];
  return domain;
};



// リファラー版(アプリ会員仕分け)
/*
	- 直前にアプリの認証ページを経由している場合→アプリ会員 localStorageにデータを格納
	- localStorageにデータが格納されている(過去に認証している)→アプリ会員
	- localStorageは期限あり(1週間経つと削除される)
	- localStorageにはreferrerApp(リファラードメイン)・referrerAppValidDate(日付)の2つデータを格納
	- 引数として(shopifyの管理画面から入力可能な)認証ページのURL(shopifyValidReferrerURL)をとる
*/

tgApp.isMemberReferrer = function(shopifyValidReferrerURL,referrerAppLocalStorage="referrerApp",referrerAppValidDateLocalStorage="referrerAppValidDate") {
  
  if(!shopifyValidReferrerURL) {
    return false
  }
	// localStorageのデータ・リファラーの取得
  const storageReferrerApp = localStorage.getItem(referrerAppLocalStorage)
  const storageReferrerAppValidDateStr = localStorage.getItem(referrerAppValidDateLocalStorage)
  const referrerApp = document.referrer;
  const referrerAppDomain = tgApp.getDomain(referrerApp);
  const storageReferrerAppDomain = tgApp.getDomain(storageReferrerApp);


  //複数の引数(ドメイン)に対応
  let shopifyValidReferrerURLArray = [];
  if(Array.isArray(shopifyValidReferrerURL)) {
    shopifyValidReferrerURLArray = shopifyValidReferrerURL
  } else {
    shopifyValidReferrerURLArray.push(shopifyValidReferrerURL);
  }

  const shopifyValidDomainArray = shopifyValidReferrerURLArray.map(item => tgApp.getDomain(item))

  // 候補のうち1つでも有効な認証ページを経由しているか
  const isAppDomainValid = shopifyValidDomainArray.some(item => {
    return referrerAppDomain === item
  })

  // 候補のうち1つでもlocalStorageに有効なデータがあるか
  const isStorageAppDomainValid = shopifyValidDomainArray.some(item => {
    return storageReferrerAppDomain.indexOf(item) != -1
  })

  // 直前にアプリの認証ページ経由ならばtrue localStorageを更新
  if (isAppDomainValid) {
    const dtNow = new Date()
    dtNow.toISOString()
    localStorage.setItem(referrerAppLocalStorage, referrerAppDomain);
    localStorage.setItem(referrerAppValidDateLocalStorage, dtNow);
    return true;
  }
  // localStorageにデータがある場合期限を確認し期限内ならばtrue localStorageは更新しない
  else if (isStorageAppDomainValid) {
    if (storageReferrerAppValidDateStr) {
      const dtSevendaysAgo = new Date()
      dtSevendaysAgo.setDate(dtSevendaysAgo.getDate() - 7); //有効期限1週間
      const storageReferrerAppValidDate = new Date(storageReferrerAppValidDateStr);
      if(storageReferrerAppValidDate >= dtSevendaysAgo) {
        return true;
      } else {
        localStorage.removeItem(referrerAppLocalStorage);
        localStorage.removeItem(referrerAppValidDateLocalStorage);
        return false;
      }
    }
    return false;
  }
  // アプリ認証されていないユーザーもしくは期限切れのユーザーはfalse
  else {
    return false;
  }
}

