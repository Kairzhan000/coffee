// Меню бургер
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('menuOverlay');

burger.addEventListener('click', () => {
  burger.classList.toggle('_active');
  mobileMenu.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  burger.classList.remove('_active');
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
});

const menuLinks = mobileMenu.querySelectorAll('a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('_active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// Функция для парсинга frontmatter в markdown
function parseMarkdown(markdown) {
  const front = markdown.match(/---([\s\S]*?)---/);
  if (!front) return {};

  const frontmatter = front[1];
  const data = {};
  frontmatter.split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length > 0) {
      data[key.trim()] = rest.join(":").trim().replace(/["']/g, "");
    }
  });
  return data;
}

// Создание карточки для Swiper
function createCard(data) {
  const card = document.createElement("div");
  card.className = "coffee_hot__inner_section_type swiper-slide"; // Твой класс + swiper-slide для слайдера
  card.innerHTML = `
    <div class="coffee_hot__inner_section_type_img">
      <img src="${data.image}" alt="${data.title}" />
    </div>
    <div class="coffee_hot__inner_section_type_main">
      <div class="coffee_hot__inner_section_type_main_top">
        <div class="coffee_hot__inner_section_type_main_top_title">${data.title}</div>
        <div class="coffee_hot__inner_section_type_main_top_info">${data.description || ''}</div>
      </div>
      <div class="coffee_hot__inner_section_type_main_bottom">
        <div class="coffee_hot__inner_section_type_main_bottom_size">${data.size || ''}</div>
        <div class="coffee_hot__inner_section_type_main_bottom_order">Order Now</div>
      </div>
    </div>
  `;
  return card;
}

// Инициализация Swiper для каждого блока
function initSwipers() {
  const swipers = document.querySelectorAll('.mySwiper');
  swipers.forEach((swiperEl) => {
    new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 2,
      spaceBetween: 20,
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  });
}

// Пример функции для загрузки карточек из md (если хочешь динамически добавлять)
// Предполагается, что у тебя есть md-файлы с frontmatter в папке /content/drinks
// Здесь нужно кастомизировать, чтобы понимать, в какой слайдер добавлять карточки
async function loadCardsIntoSlider(sliderSelector, folderUrl) {
  const container = document.querySelector(`${sliderSelector} .swiper-wrapper`);
  if (!container) {
    console.warn(`Контейнер для карточек не найден: ${sliderSelector}`);
    return;
  }

  try {
    const res = await fetch(folderUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const html = await res.text();

    const links = [...html.matchAll(/href="([^"]+\.md)"/g)];
    if (links.length === 0) {
      console.warn("Ссылок на md-файлы не найдено");
    }

    for (const match of links) {
      const fileUrl = match[1];
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        console.warn(`Не удалось загрузить ${fileUrl}: ${fileRes.status}`);
        continue;
      }
      const fileText = await fileRes.text();
      const data = parseMarkdown(fileText);
      if (data.title && data.image) {
        const card = createCard(data);
        container.appendChild(card);
      }
    }
  } catch (error) {
    console.error("Ошибка загрузки карточек:", error);
  }
}

// Запуск загрузки карточек и инициализация Swiper
document.addEventListener("DOMContentLoaded", async () => {
  // Если хочешь загрузить динамически, раскомментируй и поправь URL
  // await loadCardsIntoSlider('.coffee_hot__inner_section.hot-coffee-slider', '/content/hot-coffee');
  // await loadCardsIntoSlider('.coffee_hot__inner_section.ice-coffee-slider', '/content/ice-coffee');
  // и т.д.

  // Просто инициализируем Swiper для статичных карточек
  initSwipers();
});

// Тоггл футера
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleFooterBtn');
  const footer = document.querySelector('.footer');
  if (!toggleBtn || !footer) return;

  toggleBtn.addEventListener('click', () => {
    footer.classList.toggle('active');
  });
});
