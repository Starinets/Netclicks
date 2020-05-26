const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const cardsPlace = document.querySelector('.tv-shows__list');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const modalCross = modal.querySelector('.cross');

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

/* ----------------------------- второй вариант ----------------------------- */

const changeImage = evt => {
  const card = evt.target.closest('.tv-shows__item');

  if (card) {
    const img = card.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
    }
  }
};

cardsPlace.onmouseover = evt => changeImage(evt);
cardsPlace.onmouseout = evt => changeImage(evt);

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
