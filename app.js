let loaded = document.querySelector('.loading')

window.addEventListener("load", (event) => {
    setTimeout(
        function() {
            loaded.classList.add('d-none')
        }, 2000
    )
  });