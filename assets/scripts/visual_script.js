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