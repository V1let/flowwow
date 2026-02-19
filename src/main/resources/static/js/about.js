// js/about.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('team-grid');
    if (!grid || !teamMembers) return;

    teamMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-member';
        card.innerHTML = `
            <div class="member-photo" style="background-image: url('${member.photo}')"></div>
            <h3>${member.name}</h3>
            <div class="member-role">${member.role}</div>
            <p>${member.bio}</p>
        `;
        grid.appendChild(card);
    });
});