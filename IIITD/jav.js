document.querySelectorAll('.card').forEach(function(card) {
    card.addEventListener('click', function() {
        alert('You clicked on the name card!');
    });
});