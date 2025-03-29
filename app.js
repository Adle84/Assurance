// Données initiales
let clients = [
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@example.com", telephone: "0123456789" },
    { id: 2, nom: "Martin", prenom: "Sophie", email: "sophie.martin@example.com", telephone: "0987654321" }
];

let polices = [
    { id: 1, numero: "POL20230001", clientId: 1, type: "Auto", dateEffet: "2023-01-15", dateEcheance: "2024-01-15" },
    { id: 2, numero: "POL20230002", clientId: 2, type: "Habitation", dateEffet: "2023-02-20", dateEcheance: "2024-02-20" }
];

let sinistres = [
    { id: 1, policeId: 1, date: "2023-05-10", description: "Accident collision", statut: "En cours" },
    { id: 2, policeId: 2, date: "2023-06-15", description: "Dégât des eaux", statut: "Traité" }
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    displayClients();
    displayPolices();
    displaySinistres();
    updateStats();
    initCharts();
    setupEventListeners();
});

// Fonctions d'affichage
function displayClients(filteredClients = clients) {
    const tbody = document.querySelector('#clientsTable tbody');
    tbody.innerHTML = '';

    filteredClients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nom}</td>
            <td>${client.prenom}</td>
            <td>${client.email}</td>
            <td>${client.telephone || '-'}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${client.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${client.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateClientFilter();
}

function displayPolices(filteredPolices = polices) {
    const tbody = document.querySelector('#policesTable tbody');
    tbody.innerHTML = '';

    filteredPolices.forEach(police => {
        const client = clients.find(c => c.id == police.clientId);
        const clientName = client ? `${client.nom} ${client.prenom}` : 'Inconnu';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${police.numero}</td>
            <td>${clientName}</td>
            <td>${police.type}</td>
            <td>${formatDate(police.dateEffet)}</td>
            <td>${formatDate(police.dateEcheance)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${police.id}" data-type="police">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${police.id}" data-type="police">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePoliceFilter();
}

function displaySinistres(filteredSinistres = sinistres) {
    const tbody = document.querySelector('#sinistresTable tbody');
    tbody.innerHTML = '';

    filteredSinistres.forEach(sinistre => {
        const police = polices.find(p => p.id == sinistre.policeId);
        const policeNum = police ? police.numero : 'Inconnu';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>SIN-${sinistre.id.toString().padStart(5, '0')}</td>
            <td>${policeNum}</td>
            <td>${formatDate(sinistre.date)}</td>
            <td>${sinistre.description}</td>
            <td><span class="statut-badge ${sinistre.statut.toLowerCase()}">${sinistre.statut}</span></td>
            <td>
                <button class="action-btn edit-btn" data-id="${sinistre.id}" data-type="sinistre">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${sinistre.id}" data-type="sinistre">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fonctions utilitaires
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function updateStats() {
    document.getElementById('totalClients').textContent = clients.length;
    document.getElementById('totalPolices').textContent = polices.length;
    document.getElementById('totalSinistres').textContent = sinistres.length;
}

function updateClientFilter() {
    const select = document.getElementById('clientFilter');
    select.innerHTML = '<option value="">Tous les clients</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.nom} ${client.prenom}`;
        select.appendChild(option);
    });
}

function updatePoliceFilter() {
    const select = document.getElementById('policeFilter');
    select.innerHTML = '<option value="">Toutes les polices</option>';
    
    polices.forEach(police => {
        const client = clients.find(c => c.id == police.clientId);
        const clientName = client ? `${client.nom} ${client.prenom}` : 'Inconnu';
        
        const option = document.createElement('option');
        option.value = police.id;
        option.textContent = `${police.numero} - ${clientName}`;
        select.appendChild(option);
    });
}

// Gestion des modals
function openModal(type, id = null) {
    const modal = document.getElementById(`${type}Modal`);
    const title = document.getElementById(`${type}ModalTitle`);
    const form = document.getElementById(`${type}Form`);
    
    if (id) {
        title.textContent = `Modifier ${type === 'client' ? 'Client' : type === 'police' ? 'Police' : 'Sinistre'}`;
        
        if (type === 'client') {
            const client = clients.find(c => c.id == id);
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientNom').value = client.nom;
            document.getElementById('clientPrenom').value = client.prenom;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientPhone').value = client.telephone || '';
        } else if (type === 'police') {
            const police = polices.find(p => p.id == id);
            document.getElementById('policeId').value = police.id;
            document.getElementById('policeNumero').value = police.numero;
            document.getElementById('policeClient').value = police.clientId;
            document.getElementById('policeType').value = police.type;
            document.getElementById('policeDateEffet').value = police.dateEffet;
            document.getElementById('policeDateEcheance').value = police.dateEcheance;
        }
    } else {
        title.textContent = `Nouveau ${type === 'client' ? 'Client' : type === 'police' ? 'Police' : 'Sinistre'}`;
        form.reset();
    }
    
    // Remplir les select si nécessaire
    if (type === 'police') {
        const select = document.getElementById('policeClient');
        select.innerHTML = '';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.nom} ${client.prenom}`;
            select.appendChild(option);
        });
    }
    
    modal.style.display = 'block';
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).style.display = 'none';
}

// Graphiques
function initCharts() {
    // Graphique des types de police
    const ctx1 = document.getElementById('policesChart').getContext('2d');
    const types = ['Auto', 'Habitation', 'Santé', 'Vie'];
    const counts = types.map(type => polices.filter(p => p.type === type).length);
    
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: types,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(241, 196, 15, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des polices'
                }
            }
        }
    });

    // Graphique des statuts de sinistres
    const ctx2 = document.getElementById('sinistresChart').getContext('2d');
    const statuts = ['En cours', 'Traité', 'Rejeté'];
    const sinistreCounts = statuts.map(statut => sinistres.filter(s => s.statut === statut).length);
    
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: statuts,
            datasets: [{
                label: 'Nombre de sinistres',
                data: sinistreCounts,
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Statut des sinistres'
                }
            }
        }
    });
}

// Gestion des événements
function setupEventListeners() {
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Boutons d'ajout
    document.getElementById('addClientBtn').addEventListener('click', () => openModal('client'));
    document.getElementById('addPoliceBtn').addEventListener('click', () => openModal('police'));
    document.getElementById('addSinistreBtn').addEventListener('click', () => openModal('sinistre'));

    // Fermeture des modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Clic en dehors des modals
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Formulaire client
    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('clientId').value;
        const clientData = {
            nom: document.getElementById('clientNom').value,
            prenom: document.getElementById('clientPrenom').value,
            email: document.getElementById('clientEmail').value,
            telephone: document.getElementById('clientPhone').value
        };
        
        if (id) {
            // Modification
            const index = clients.findIndex(c => c.id == id);
            clients[index] = { ...clients[index], ...clientData };
        } else {
            // Ajout
            clientData.id = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
            clients.push(clientData);
        }
        
        displayClients();
        updateStats();
        closeModal('client');
    });

    // Formulaire police
    document.getElementById('policeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('policeId').value;
        const policeData = {
            numero: document.getElementById('policeNumero').value,
            clientId: parseInt(document.getElementById('policeClient').value),
            type: document.getElementById('policeType').value,
            dateEffet: document.getElementById('policeDateEffet').value,
            dateEcheance: document.getElementById('policeDateEcheance').value
        };
        
        if (id) {
            // Modification
            const index = polices.findIndex(p => p.id == id);
            polices[index] = { ...polices[index], ...policeData };
        } else {
            // Ajout
            policeData.id = polices.length ? Math.max(...polices.map(p => p.id)) + 1 : 1;
            polices.push(policeData);
        }
        
        displayPolices();
        updateStats();
        closeModal('police');
    });

    // Recherche clients
    document.getElementById('searchClient').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredClients = clients.filter(client => 
            client.nom.toLowerCase().includes(searchTerm) || 
            client.prenom.toLowerCase().includes(searchTerm) ||
            (client.email && client.email.toLowerCase().includes(searchTerm))
        );
        displayClients(filteredClients);
    });

    // Filtre par client
    document.getElementById('clientFilter').addEventListener('change', function() {
        const clientId = this.value;
        const filteredPolices = clientId ? polices.filter(p => p.clientId == clientId) : polices;
        displayPolices(filteredPolices);
    });

    // Filtre par police
    document.getElementById('policeFilter').addEventListener('change', function() {
        const policeId = this.value;
        const filteredSinistres = policeId ? sinistres.filter(s => s.policeId == policeId) : sinistres;
        displaySinistres(filteredSinistres);
    });

    // Gestion des clics sur les boutons d'action
    document.addEventListener('click', function(e) {
        // Édition
        if (e.target.closest('.edit-btn')) {
            const btn = e.target.closest('.edit-btn');
            const type = btn.dataset.type || 'client';
            openModal(type, btn.dataset.id);
        }
        
        // Suppression
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const type = btn.dataset.type || 'client';
            const id = parseInt(btn.dataset.id);
            
            if (confirm(`Supprimer cet élément ?`)) {
                if (type === 'client') {
                    clients = clients.filter(c => c.id !== id);
                    polices = polices.filter(p => p.clientId !== id);
                    displayClients();
                    displayPolices();
                } else if (type === 'police') {
                    polices = polices.filter(p => p.id !== id);
                    sinistres = sinistres.filter(s => s.policeId !== id);
                    displayPolices();
                    displaySinistres();
                } else if (type === 'sinistre') {
                    sinistres = sinistres.filter(s => s.id !== id);
                    displaySinistres();
                }
                
                updateStats();
            }
        }
    });

    // Formulaire de contact
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            alert(`Merci pour votre message, ${name} ! Nous vous contacterons bientôt.`);
            this.reset();
        } else {
            alert('Veuillez remplir tous les champs');
        }
    });
}