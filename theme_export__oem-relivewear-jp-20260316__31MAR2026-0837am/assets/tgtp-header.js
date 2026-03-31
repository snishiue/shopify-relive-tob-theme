const hamburger = document.getElementsByClassName("hamburger")[0];
const sidebarBg = document.getElementsByClassName("sidebar-bg")[0];
const sidebar = document.getElementsByClassName("sidebar")[0];
const sidebarClose = document.getElementsByClassName("sidebar__close")[0];
const sidebarLinkFirst = Array.from(document.getElementsByClassName("sidebar__link--first"));
const sidebarLinkSecond = Array.from(document.getElementsByClassName("sidebar__link--second"));
const body = document.body;
const searchBtn = Array.from(document.getElementsByClassName("search-btn"));
const searchForm = document.querySelector(".search-form");
const searchFormClose = document.querySelector(".search-form__close");

function closeLinkSecond() {
  sidebarLinkSecond.forEach(element => {
    element.classList.remove("open");
    element.parentNode.classList.remove("open");
  });
}

function closeLinkFirst() {
  if (sidebarLinkSecond.length > 0) {
    closeLinkSecond();
  }
  if (sidebarLinkFirst.length > 0) {
    sidebarLinkFirst.forEach(element => {
      element.classList.remove("open");
      element.parentNode.classList.remove("open");
    });
  }
}

hamburger.addEventListener('click', () => {
  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    sidebarBg.style.visibility = "hidden";
    body.style.overflow = null;
  } else {
    sidebar.classList.add("open");
    sidebarBg.style.visibility = null;
    body.style.overflow = "hidden";
  }
});

sidebarBg.addEventListener('click', () => {
  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    sidebarBg.style.visibility = "hidden";
    body.style.overflow = null;
    closeLinkFirst();
  } else {
    sidebar.classList.add("open");
    sidebarBg.style.visibility = null;
    body.style.overflow = "hidden";
  }
});

sidebarClose.addEventListener('click', () => {
  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    sidebarBg.style.visibility = "hidden";
    body.style.overflow = null;
    closeLinkFirst();
  } else {
    sidebar.classList.add("open");
    sidebarBg.style.visibility = null;
    body.style.overflow = "hidden";
  }
});

if (sidebarLinkFirst.length > 0) {
  sidebarLinkFirst.forEach(element => {
    element.addEventListener('click', () => {
      if (element.classList.contains("open")) {
        closeLinkFirst();
      } else {
        closeLinkFirst();
        element.classList.add("open");
        element.parentNode.classList.add("open");
        // elementがaタグの場合はスクロールしない
        if (element.tagName.toLowerCase() === 'a') {
          return;
        }
        element.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

if (sidebarLinkSecond.length > 0) {
  sidebarLinkSecond.forEach(element => {
    element.addEventListener('click', () => {
      if (element.classList.contains("open")) {
        closeLinkSecond();
      } else {
        closeLinkSecond();
        element.classList.add("open");
        element.parentNode.classList.add("open");
      }
    })
  })
}

searchFormClose.addEventListener('click', (event) => {
  searchForm.classList.remove("open");
  event.stopPropagation();
});

searchForm.addEventListener('click', (event) => {
  event.stopPropagation();
});

body.addEventListener('click', (event) => {
  if (searchBtn.some(btn => btn.contains(event.target))) {
    return;
  }

  if (searchForm && searchForm.classList.contains("open")) {
    searchForm.classList.remove("open");
  }
});

searchBtn.forEach((element) => {
  element.addEventListener('click', (event) => {
    if (!searchForm.classList.contains("open")) {
      searchForm.classList.add("open");
    }
    event.stopPropagation();
  });
});

/* メガメニュー */

const megaMenuItem = Array.from(document.querySelectorAll('.nav-item [aria-controls]'));

megaMenuItem.forEach((element) => {
  element.addEventListener('click', () => {
    megaMenuClose();
    megaMenuOpen(element);
  });
  element.addEventListener('mouseover', () => {
    megaMenuClose();
    megaMenuOpen(element);
  });
});

body.addEventListener('click', (event) => {
  if (megaMenuItem) {
    if (event.target.dataset.type != 'menu' && event.target.dataset.type != 'menuitem') {
      megaMenuClose();
    }
  }
});

function megaMenuOpen(element) {
  const menuId = element.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    const expanded = element.getAttribute('aria-expanded');

    element.setAttribute('aria-expanded', !expanded);
    menu.setAttribute('aria-hidden', expanded);
}

function megaMenuClose() {
  megaMenuItem.forEach((element) => {
    const menuId = element.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    element.setAttribute('aria-expanded', false);
    menu.setAttribute('aria-hidden', true);
  });
}

// メガメニューのマウスオーバー処理
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const megaMenus = document.querySelectorAll('.mega-menu');

  // 各ナビゲーション項目にマウスオーバーイベントを追加
  navItems.forEach(item => {
    const menuId = item.getAttribute('data-menu-id');
    if (menuId) {
      const megaMenu = document.getElementById(menuId);

      // マウスオーバー時にメガメニューを表示
      item.addEventListener('mouseenter', function() {
        megaMenus.forEach(menu => {
          menu.setAttribute('aria-hidden', 'true');
        });
        if (megaMenu) {
          megaMenu.setAttribute('aria-hidden', 'false');
        }
      });
    }
  });

  // メガメニューとナビゲーション項目にマウスリーブイベントを追加
  const header = document.querySelector('header');
  header.addEventListener('mouseleave', function() {
    megaMenus.forEach(menu => {
      menu.setAttribute('aria-hidden', 'true');
    });
  });

  // 各メガメニューにマウスリーブイベントを追加
  megaMenus.forEach(menu => {
    menu.addEventListener('mouseleave', function() {
      this.setAttribute('aria-hidden', 'true');
    });
  });
});
