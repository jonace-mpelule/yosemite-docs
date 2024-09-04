const searchInput = document.querySelector('#search');
const endpointList = document.querySelectorAll('.endpoint');

searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();

    endpointList.forEach(endpoint => {
        const route = endpoint.querySelector('.route').textContent.toLowerCase();
        const description = endpoint.querySelector('.description').textContent.toLowerCase();
        const isMatch = route.includes(searchQuery) || description.includes(searchQuery);

        if (isMatch) {
            endpoint.style.display = 'block';
        } else {
            endpoint.style.display = 'none';
        }
    });
});
