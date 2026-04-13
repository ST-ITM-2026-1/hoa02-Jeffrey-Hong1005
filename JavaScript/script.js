function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    const modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        if (document.body.classList.contains('dark-mode')) {
            btn.textContent = 'Light Mode';
        } else {
            btn.textContent = 'Dark Mode';
        }
    });
}

function setupProjectFilter() {
    const filterButtons = document.querySelectorAll('.projects-buttons button');
    const projects = document.querySelectorAll('.content[data-category]');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const category = button.getAttribute('data-filter');

            filterButtons.forEach(function(btn) {
                btn.classList.remove('active-btn');
            });
            button.classList.add('active-btn');

            projects.forEach(function(project) {
                if (category === 'all' || project.getAttribute('data-category') === category) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        btn.addEventListener('click', toggleTheme);
    });

    setupProjectFilter();
});
