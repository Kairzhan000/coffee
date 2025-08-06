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

// Загрузка карточек кофе и инициализация Swiper
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".coffee .swiper-wrapper"); // Здесь правильный контейнер для swiper-слайдов
  if (!container) return;

  try {
    const res = await fetch("/content/drinks");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const html = await res.text();
    const links = [...html.matchAll(/href="([^"]+\.md)"/g)];

    for (const match of links) {
      const fileUrl = match[1];
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        console.warn(`Failed to load ${fileUrl}: ${fileRes.status}`);
        continue;
      }
      const fileText = await fileRes.text();
      const data = parseMarkdown(fileText);
      if (data.title && data.image) {
        const card = createCard(data);
        container.appendChild(card);
      }
    }

    // Инициализируем Swiper после загрузки карточек
    new Swiper(".mySwiper", {
      loop: true, // бесконечный свайп
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });

  } catch (error) {
    console.error("Ошибка загрузки карточек кофе:", error);
  }

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

  function createCard(data) {
    const card = document.createElement("div");
    card.className = "coffee-card swiper-slide"; // swiper-slide для корректной работы Swiper
    card.innerHTML = `
      <img src="${data.image}" alt="${data.title}" />
      <h3>${data.title}</h3>
      <p>${data.description || ''}</p>
      <span>${data.price || ''}</span>
    `;
    return card;
  }
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
