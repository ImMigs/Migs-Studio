document.addEventListener('DOMContentLoaded', () => {
    const changelog = document.querySelector('.container-changelog');
    if (changelog) {
        const header = changelog.querySelector('.changelog-header');
        header.addEventListener('click', () => {
            changelog.classList.toggle('active');
        });
    }
});