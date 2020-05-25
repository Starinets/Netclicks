const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const cardsPlace = document.querySelector('.tv-shows__list');
let oldImg = null;
let cardHandler = null;

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

/* ---------- через CSS это гораздо проще и эффективней сделать ;-) --------- */
cardsPlace.onmouseover = evt => {
  const card = evt.target.closest('.tv-card');

  if (card) {
    if (cardHandler !== card) {
      const img = card.querySelector('.tv-card__img');

      oldImg = img.getAttribute('data-backdrop');
      if (!oldImg) return;
      img.setAttribute('data-backdrop', img.src);
      img.src = oldImg;

      cardHandler = card;
    }
  } else {
    if (cardHandler) {
      const img = cardHandler.querySelector('.tv-card__img');

      oldImg = img.getAttribute('data-backdrop');
      if (!oldImg) return;
      img.setAttribute('data-backdrop', img.src);
      img.src = oldImg;

      cardHandler = null;
    }
  }
};
