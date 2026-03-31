window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

// window.onload = function(){
//   let perfEntries = performance.getEntriesByType("navigation");
//   perfEntries.forEach(function(pe){
//     let type = pe.type;
//     if (type === "back_forward") {
//       window.location.reload();
//     }
//   });
// };

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    location.reload();
  }
});

// 時刻制御用
// 日付をまたいだ場合にカートをリロードする
// 初回読み込み時の現在時刻を取得
let initialTime = new Date();
let reloadTriggered = false;

// 1秒ごとに現在時刻を確認
setInterval(function() {
  let currentTime = new Date();

  // 日付が変わった場合にイベントを実行
  if (currentTime.getDate() !== initialTime.getDate() && !reloadTriggered) {
    // 触れたときにリロード
    attachEvent();
    // 触れてないときでも5分経ったらリロード
    setTimeout(function() {
      location.reload(true);
    }, 300000);
    reloadTriggered = true;
  }
}, 1000);

// イベントを付与する関数
function attachEvent() {
  document.addEventListener('touchstart', function() {
    // ページをリロード
    location.reload(true);
  });
}