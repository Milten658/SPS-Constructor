const options = document.querySelectorAll('.posluga_wrapper');
const body = document.body;
const search_input = document.querySelector('.top_search');
const search_field = document.querySelector('.search_field');

document.querySelectorAll('.dropdown_wrapper').forEach(wrapper => {
  const main = wrapper.querySelector('.dropdown_main');
  const list = wrapper.querySelector('.dropdown_list');
  const fill = wrapper.querySelector('.dropdown_fill');

  main.addEventListener('click', (e) => {
    e.stopPropagation();

    document.querySelectorAll('.dropdown_wrapper').forEach(w => {
      const l = w.querySelector('.dropdown_list');
      if (l && l !== list) {
        l.classList.remove('active');
      } 
    });

    list.classList.toggle('active');
  });

  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown_option')) {
      fill.textContent = e.target.textContent;
      list.classList.remove('active');
    }
  });
});

options.forEach(option => {
  option.addEventListener('click', () => {

    const form = option.nextElementSibling;
    const isOpen = option.classList.contains('active');

    options.forEach(o => {
      o.classList.remove('active');

      const f = o.nextElementSibling;
      if (f) {
        f.style.height = '0px';
      }
    });

    body.classList.remove('remont', 'obmin');

    if (!isOpen) {
      option.classList.add('active');

      const name = option.dataset.name;
      if (name) {
        body.classList.add(name);
      }

      form.style.height = 'auto';
      const height = form.scrollHeight;

      form.style.height = '0px';

      requestAnimationFrame(() => {
        form.style.height = height + 'px';
      });

    } else {
      form.style.height = '0px';
    }
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown_list').forEach(list => {
    list.classList.remove('active');
  });
});




if (search_input && search_field) {

  search_input.addEventListener('focus', () => {
    search_field.classList.add('active');
  });

  search_input.addEventListener('blur', () => {
    setTimeout(() => {
      search_field.classList.remove('active');
    }, 150);
  });

}