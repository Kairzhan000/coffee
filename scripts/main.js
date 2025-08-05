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

// Загрузка карточек кофе
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("coffeeCards");
  if (!container) return;

  try {
    const res = await fetch("/content/drinks");
    const html = await res.text();
    const links = [...html.matchAll(/href="([^"]+\.md)"/g)];

    for (const match of links) {
      const fileUrl = match[1];
      const fileRes = await fetch(fileUrl);
      const fileText = await fileRes.text();
      const data = parseMarkdown(fileText);
      const card = createCard(data);
      container.appendChild(card);
    }
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
    card.className = "coffee-card";
    card.innerHTML = `
      <img src="${data.image}" alt="${data.title}" />
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <span>${data.price}</span>
    `;
    return card;
  }
});
