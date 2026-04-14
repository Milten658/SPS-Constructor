const search_input = document.querySelector('.top_search');
const search_field = document.querySelector('.search_field');




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