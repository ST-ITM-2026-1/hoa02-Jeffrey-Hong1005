function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    var modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        if (document.body.classList.contains('dark-mode')) {
            btn.textContent = 'Light Mode';
        } else {
            btn.textContent = 'Dark Mode';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        btn.addEventListener('click', toggleTheme);
    });
});
