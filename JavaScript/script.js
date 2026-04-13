function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    const modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
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

async function loadProfile(username) {
    const profileContent = document.querySelector('.profile-content');
    if (!profileContent) return;

    profileContent.innerHTML = '<p class="loading">Loading profile...</p>';

    try {
        const response = await fetch('https://api.github.com/users/' + username);
        if (!response.ok) {
            throw new Error('Failed to fetch profile. Status: ' + response.status);
        }
        const profile = await response.json();
        displayProfile(profile);
    } catch (error) {
        profileContent.innerHTML = '<p class="error-msg">⚠️ Failed to load GitHub profile. Please try again later.</p>';
        console.error('Profile fetch error:', error);
    }
}

async function loadRepos(username) {
    const container = document.querySelector('.Repositories');
    if (!container) return;

    container.innerHTML = '<p class="loading">Loading repositories...</p>';

    try {
        const response = await fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=30');
        if (!response.ok) {
            throw new Error('Failed to fetch repos. Status: ' + response.status);
        }
        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        container.innerHTML = '<p class="error-msg">⚠️ Failed to load repositories. Please try again later.</p>';
        console.error('Repos fetch error:', error);
    }
}

async function loadGithubData() {
    const username = 'Jeffrey-Hong1005';
    await loadProfile(username);
    await loadRepos(username);
}

function displayProfile(profile) {
    const profileContent = document.querySelector('.profile-content');
    if (!profileContent) return;

    profileContent.innerHTML = '';

    const img = document.createElement('img');
    img.src = profile.avatar_url;
    img.alt = profile.login + "'s GitHub avatar";
    img.className = 'profile-image';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'profile-info';

    const nameEl = document.createElement('h3');
    nameEl.className = 'ID';
    const nameLink = document.createElement('a');
    nameLink.href = profile.html_url;
    nameLink.target = '_blank';
    nameLink.textContent = profile.name || profile.login;
    nameEl.appendChild(nameLink);

    const usernameEl = document.createElement('p');
    usernameEl.className = 'github-username';
    usernameEl.textContent = '@' + profile.login;

    const bioEl = document.createElement('p');
    bioEl.className = 'github-bio';
    bioEl.textContent = profile.bio || 'No bio available.';

    const statsDiv = document.createElement('div');
    statsDiv.className = 'profile-stats';

    const reposSpan = document.createElement('span');
    reposSpan.textContent = '📂 Repos: ' + profile.public_repos;

    const followersSpan = document.createElement('span');
    followersSpan.textContent = '👥 Followers: ' + profile.followers;

    const followingSpan = document.createElement('span');
    followingSpan.textContent = '👤 Following: ' + profile.following;

    statsDiv.appendChild(reposSpan);
    statsDiv.appendChild(followersSpan);
    statsDiv.appendChild(followingSpan);

    infoDiv.appendChild(nameEl);
    infoDiv.appendChild(usernameEl);
    infoDiv.appendChild(bioEl);
    infoDiv.appendChild(statsDiv);

    profileContent.appendChild(img);
    profileContent.appendChild(infoDiv);
}

function displayRepos(repos) {
    const container = document.querySelector('.Repositories');
    if (!container) return;

    container.innerHTML = '';

    const allowedRepos = [
        '2025_Global-Challenger',
        'ITContest2025',
        'Genport-AI-Portfolio',
        'OSS_teamproject'
    ];

    const filteredRepos = repos.filter(function(repo) {
        if (allowedRepos.indexOf(repo.name) !== -1) return true;
        if (repo.name.indexOf('GDGOC') !== -1) return true;
        return false;
    });

    let genportIndex = -1;
    let challengerIndex = -1;
    filteredRepos.forEach(function(repo, index) {
        if (repo.name === 'Genport-AI-Portfolio') genportIndex = index;
        if (repo.name === '2025_Global-Challenger') challengerIndex = index;
    });
    if (genportIndex !== -1 && challengerIndex !== -1) {
        const temp = filteredRepos[genportIndex];
        filteredRepos[genportIndex] = filteredRepos[challengerIndex];
        filteredRepos[challengerIndex] = temp;
    }

    if (filteredRepos.length === 0) {
        container.innerHTML = '<p class="loading">No matching repositories found.</p>';
        return;
    }

    filteredRepos.forEach(function(repo) {
        const card = document.createElement('div');
        card.className = 'Repo-intro';

        const titleEl = document.createElement('h4');
        const titleLink = document.createElement('a');
        titleLink.href = repo.html_url;
        titleLink.target = '_blank';
        titleLink.className = 'repo-link';
        titleLink.textContent = repo.name;
        titleEl.appendChild(titleLink);

        const descEl = document.createElement('p');
        descEl.className = 'repo-desc';
        descEl.textContent = repo.description || 'No description provided.';

        const metaDiv = document.createElement('div');
        metaDiv.className = 'repo-meta';

        const langSpan = document.createElement('span');
        langSpan.textContent = '🖥 ' + (repo.language || 'N/A');

        const starsSpan = document.createElement('span');
        starsSpan.textContent = '⭐ ' + repo.stargazers_count;

        const forksSpan = document.createElement('span');
        forksSpan.textContent = '🍴 ' + repo.forks_count;

        metaDiv.appendChild(langSpan);
        metaDiv.appendChild(starsSpan);
        metaDiv.appendChild(forksSpan);

        card.appendChild(titleEl);
        card.appendChild(descEl);
        card.appendChild(metaDiv);

        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('.mode').forEach(function(btn) {
            btn.textContent = 'Light Mode';
        });
    }

    const modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(function(btn) {
        btn.addEventListener('click', toggleTheme);
    });

    setupProjectFilter();

    const githubSection = document.querySelector('.github');
    if (githubSection) {
        loadGithubData();
    }
});
