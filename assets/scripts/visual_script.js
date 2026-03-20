const options = document.querySelectorAll('.posluga_wrapper');
const body = document.body;

// ===== DROPDOWN =====
const main = document.querySelector('.dropdown_main');
const list = document.querySelector('.dropdown_list');
const fill = document.querySelector('.dropdown_fill');

main.addEventListener('click', (e) => {
  e.stopPropagation();
  list.classList.toggle('active');
});

list.addEventListener('click', (e) => {
  if (e.target.classList.contains('dropdown_option')) {
    fill.textContent = e.target.textContent;
    list.classList.remove('active');
  }
});

// ===== ACCORDION =====
options.forEach(option => {
  option.addEventListener('click', () => {

    const isOpen = option.classList.contains('active');

    options.forEach(o => o.classList.remove('active'));

    body.classList.remove('remont', 'obmin');

    if (!isOpen) {
      option.classList.add('active');

      const name = option.dataset.name;

      if (name) {
        body.classList.add(name);
      }
    }
  });
});

// ===== CLOSE DROPDOWN =====
document.addEventListener('click', () => {
  list.classList.remove('active');
});