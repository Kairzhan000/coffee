// Пример загрузки карточек (если контент в JSON или Markdown с front matter)
fetch('/content/drinks')
  .then(response => response.text())
  .then(text => {
    // обработка данных и вставка на страницу
    // либо используй библиотеку вроде `gray-matter` + markdown parser
  });
