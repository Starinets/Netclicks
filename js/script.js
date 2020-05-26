const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const modalCross = modal.querySelector('.cross');

const DBService = class {
  getData = async url => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    }

    throw new Error(`не удалось получить данные по адресу ${url}`);
  };

  getTestData = () => {
    return this.getData('test.json');
  };
};

/* --------------------------- генератор карточек --------------------------- */
const renderCard = response => {
  response.results.forEach(item => {
    // prettier-ignore
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote
    } = item;

    const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : './img/no-poster.jpg';
    const voteElem = '';

    const card = document.createElement('li');

    //card.classList.add('tv-show__item'); // добавит коасс к существующим
    card.className = 'tv-shows__item'; // установит в коасс строку, затерев старые классы

    card.innerHTML = `
      <a href="#" class="tv-card">
        <span class="tv-card__vote">${vote}</span>
        <img
          class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}"
        />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    tvShowList.append(card);
  });
};

new DBService().getTestData().then(renderCard);

/* ------------------------------ открыть меню ------------------------------ */
hamburger.onclick = () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
};

document.body.onclick = evt => {
  if (!evt.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
};

leftMenu.onclick = evt => {
  const target = evt.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
};

/* --- будет работать только если навести непосредственно на саму картинку -- */
// document.querySelectorAll('.tv-card__img').forEach((el, src) => {
//   el.addEventListener('mouseenter', () => (src = el.src) && (el.src = el.getAttribute('data-backdrop')));
//   el.addEventListener('mouseleave', () => el.src = src);
// })

/* ----------------------------- смена картинок карточек ----------------------------- */

const changeImage = evt => {
  const card = evt.target.closest('.tv-shows__item');

  if (card) {
    const img = card.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
    }
  }
};

tvShowList.onmouseover = evt => changeImage(evt);
tvShowList.onmouseout = evt => changeImage(evt);

/* ------------------------ открытие модального окна ------------------------ */
tvShowList.onclick = evt => {
  evt.preventDefault();

  const target = evt.target;
  const card = target.closest('.tv-card');

  if (card) {
    //убираем вертикальный скролл при выводе модального окна
    document.body.style.overflow = 'hidden';
    modal.style.background = 'rgba(0, 0, 0, 0.8)';
    modal.classList.remove('hide');
  }
};

modal.onclick = evt => {
  // не красиво, но для примера можно
  if (evt.target.closest('.cross') || evt.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
};
