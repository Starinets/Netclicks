const MBD_API = 'bfd0429ad37e2ead2de0b1e98d811db8';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const modalCross = modal.querySelector('.cross');
const tvShows = document.querySelector('.tv-shows');

const tvCardIMG = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');

const loading = document.createElement('div');
loading.className = 'loading';

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

  getTestCard = () => {
    return this.getData('card.json');
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
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');

    //card.classList.add('tv-show__item'); // добавит коасс к существующим
    card.className = 'tv-shows__item'; // установит в коасс строку, затерев старые классы

    card.innerHTML = `
      <a href="#" class="tv-card">
        ${voteElem}
        <img
          class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}"
        />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    loading.remove(); // удаляем loading
    tvShowList.append(card);
  });
};

{
  // отображаем loading
  tvShowList.append(loading);
  new DBService().getTestData().then(renderCard);
}

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

/* ------------------------- смена картинок карточек ------------------------ */

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
    // prettier-ignore
    new DBService()
      .getTestCard()
      .then(response => {
        tvCardIMG.src = IMG_URL + response.poster_path;
        modalTitle.textContent = response.name;
        //собираем в acc элементы списка
        // в первой итерации в acc попадет первый элемент массива, поэтому третим параметром передаем ''
        genresList.innerHTML = response.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, ''); 
        
        //старый способ сборки списка
        // genresList.textContent = ''; // работает быстрее чем .innerHTML = ''
        // for (const item of response.genres) {
        //   genresList.innerHTML += `<li>${item.name}</li>`;  
        // }

        // и еще один способ через forEach
        // genresList.textContent = '';
        // response.genres.forEach(item => {
        //   genresList.innerHTML += `<li>${item.name}</li>`; 
        // });

      })
      .then(() => {
        // перенесли показ модалки в асинхронное выполнение, для того,
        // чтобы модальное окно отображалосьб только после получения json от сервера

        //убираем вертикальный скролл при выводе модального окна
        document.body.style.overflow = 'hidden';
        modal.style.background = 'rgba(0, 0, 0, 0.8)';
        modal.classList.remove('hide');
      });
  }
};

modal.onclick = evt => {
  // не красиво, но для примера можно
  if (evt.target.closest('.cross') || evt.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
};
