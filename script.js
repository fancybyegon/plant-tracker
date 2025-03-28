// Plant Database (would typically come from an API in a real app)
const plantDatabase = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        scientificName: "Monstera deliciosa",
        origin: "Tropical forests of Central America",
        image: "https://i.pinimg.com/736x/1c/2a/0f/1c2a0f667ca99e56b60ce3a48985967a.jpg",
        waterFrequency: 7,
        light: "Bright, indirect light",
        humidity: "Medium to high",
        careTips: [
            "Water when the top 2 inches of soil are dry",
            "Wipe leaves monthly to remove dust",
            "Provide a moss pole for support as it grows",
            "Rotate plant regularly for even growth"
        ],
        wateringAdjustment: 1.2
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        scientificName: "Ficus lyrata",
        origin: "Western Africa",
        image: "https://i.pinimg.com/736x/48/fd/20/48fd2094641c0464c6a04cb146353e69.jpg",
        waterFrequency: 7,
        light: "Bright, indirect light",
        humidity: "Medium",
        careTips: [
            "Water thoroughly when top inch of soil is dry",
            "Avoid moving the plant frequently",
            "Dust leaves regularly for optimal photosynthesis",
            "Prune to maintain shape and encourage branching"
        ],
        wateringAdjustment: 1.3
    },
    {
        id: 3,
        name: "Snake Plant",
        scientificName: "Sansevieria trifasciata",
        origin: "West Africa",
        image: "https://i.pinimg.com/736x/ad/9f/f5/ad9ff5303f28b17f53872e9838a83de9.jpg",
        waterFrequency: 14,
        light: "Low to bright indirect light",
        humidity: "Low",
        careTips: [
            "Allow soil to dry completely between waterings",
            "Very drought tolerant - better to underwater",
            "Excellent air purifying qualities",
            "Can tolerate low light but grows slower"
        ],
        wateringAdjustment: 0.8
    },
    {
        id: 4,
        name: "Peace Lily",
        scientificName: "Spathiphyllum wallisii",
        origin: "Central America",
        image: "https://i.pinimg.com/736x/8d/1f/f0/8d1ff044713baf6db6ef18045a8e6383.jpg",
        waterFrequency: 5,
        light: "Medium to low indirect light",
        humidity: "High",
        careTips: [
            "Keep soil consistently moist but not soggy",
            "Leaves will droop when thirsty - great indicator",
            "Benefits from regular misting",
            "Remove spent flowers to encourage new blooms"
        ],
        wateringAdjustment: 1.5
    },
    {
        id: 5,
        name: "ZZ Plant",
        scientificName: "Zamioculcas zamiifolia",
        origin: "Eastern Africa",
        image: "https://i.pinimg.com/736x/1e/ab/89/1eab892687112ab002fd19ec91462cdb.jpg",
        waterFrequency: 21,
        light: "Low to bright indirect light",
        humidity: "Low",
        careTips: [
            "Water only when soil is completely dry",
            "Extremely drought tolerant",
            "Grows well in low-light conditions",
            "Wipe leaves occasionally to keep them shiny"
        ],
        wateringAdjustment: 0.7
    },
    {
        id: 6,
        name: "Pothos",
        scientificName: "Epipremnum aureum",
        origin: "French Polynesia",
        image: "https://i.pinimg.com/736x/10/04/67/1004675e8c5c17f2d9826bc84b97bf18.jpg",
        waterFrequency: 7,
        light: "Low to bright indirect light",
        humidity: "Medium",
        careTips: [
            "Water when top inch of soil is dry",
            "Easy to propagate in water",
            "Prune regularly to maintain bushiness",
            "Can trail or climb with support"
        ],
        wateringAdjustment: 1.1
    }
];

let userPlants = [
    { id: 1, plantId: 1, nickname: "Monsty", lastWatered: new Date('2023-06-10').toISOString(), location: "Living room" },
    { id: 2, plantId: 3, nickname: "Jimmy", lastWatered: new Date('2023-06-05').toISOString(), location: "Bedroom" },
    { id: 3, plantId: 6, nickname: "Melissa", lastWatered: new Date('2023-06-08').toISOString(), location: "Kitchen shelf" }
];

let currentWeather = {
    temp: 22,
    humidity: 65,
    conditions: "Partly cloudy",
    icon: "fa-cloud-sun"
};

const plantListEl = document.getElementById('plant-list');
const plantDetailsEl = document.getElementById('plant-details');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const conditionsEl = document.getElementById('conditions');
const locationInputEl = document.getElementById('location-input');
const updateWeatherBtn = document.getElementById('update-weather');
const addPlantBtn = document.getElementById('add-plant');
const notificationEl = document.getElementById('notification');

function init() {
    renderPlantList();
    loadWeather();
    setupEventListeners();
}

function renderPlantList() {
    plantListEl.innerHTML = '';
    
    if (userPlants.length === 0) {
        plantListEl.innerHTML = '<p class="no-plants">No plants added yet</p>';
        return;
    }
    
    userPlants.forEach(userPlant => {
        const plantData = plantDatabase.find(p => p.id === userPlant.plantId);
        if (!plantData) return;
        
        const daysUntilWatering = getDaysUntilWatering(userPlant);
        const needsWater = daysUntilWatering <= 0;
        
        const plantItem = document.createElement('div');
        plantItem.className = `plant-item ${needsWater ? 'needs-water' : ''}`;
        plantItem.dataset.id = userPlant.id;
        
        plantItem.innerHTML = `
            <div class="plant-icon">
                <i class="fas fa-leaf"></i>
            </div>
            <div class="plant-info">
                <div class="plant-name">${userPlant.nickname || plantData.name}</div>
                <div class="plant-type">${plantData.name}</div>
                <div class="water-status">${needsWater ? 'Needs water!' : `Water in ${daysUntilWatering} days`}</div>
            </div>
        `;
        
        plantItem.addEventListener('click', () => showPlantDetails(userPlant.id));
        plantListEl.appendChild(plantItem);
    });
}

function showPlantDetails(userPlantId) {
    const userPlant = userPlants.find(p => p.id === userPlantId);
    if (!userPlant) return;
    
    const plantData = plantDatabase.find(p => p.id === userPlant.plantId);
    if (!plantData) return;
    
    const adjustedWaterFrequency = calculateAdjustedWaterFrequency(plantData);
    const lastWateredDate = new Date(userPlant.lastWatered);
    const nextWateringDate = new Date(lastWateredDate);
    nextWateringDate.setDate(lastWateredDate.getDate() + adjustedWaterFrequency);
    
    document.querySelectorAll('.plant-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === userPlantId) {
            item.classList.add('active');
        }
    });
    
    plantDetailsEl.innerHTML = `
        <div class="plant-detail-view">
            <div class="detail-header">
                <div class="detail-title">
                    <h2>${userPlant.nickname || plantData.name}</h2>
                    <p>${plantData.scientificName}</p>
                </div>
                <div class="water-status">
                    <h3>Next watering</h3>
                    <p>${formatDate(nextWateringDate)}</p>
                </div>
            </div>
            
            <div class="detail-content">
                <div class="plant-image-container">
                    <img src="${plantData.image}" alt="${plantData.name}" class="plant-image">
                </div>
                <div class="detail-info">
                    <div class="info-card">
                        <h3><i class="fas fa-info-circle"></i> Plant Profile</h3>
                        <p><strong>Origin:</strong> ${plantData.origin}</p>
                        <p><strong>Location:</strong> ${userPlant.location}</p>
                        <p><strong>Light needs:</strong> ${plantData.light}</p>
                        <p><strong>Humidity preference:</strong> ${plantData.humidity}</p>
                    </div>
                    
                    <div class="info-card">
                        <h3><i class="fas fa-lightbulb"></i> Care Tips</h3>
                        <ul>
                            ${plantData.careTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="watering-guide">
                <h3>Watering Schedule</h3>
                <p>Based on current weather conditions in your area, your ${plantData.name} should be watered every <strong>${adjustedWaterFrequency} days</strong>.</p>
                
                <div class="watering-dates">
                    <div class="date-card">
                        <h4>Last watered</h4>
                        <p>${formatDate(lastWateredDate)}</p>
                    </div>
                    <div class="date-card next-watering">
                        <h4>Next watering</h4>
                        <p>${formatDate(nextWateringDate)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getDaysUntilWatering(userPlant) {
    const plantData = plantDatabase.find(p => p.id === userPlant.plantId);
    if (!plantData) return 0;
    
    const adjustedFrequency = calculateAdjustedWaterFrequency(plantData);
    const lastWatered = new Date(userPlant.lastWatered);
    const today = new Date();
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(lastWatered.getDate() + adjustedFrequency);
    
    const diffTime = nextWatering - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}


function calculateAdjustedWaterFrequency(plantData) {
    let adjustment = 1;

    if (currentWeather.temp > 25) { 
        adjustment *= plantData.wateringAdjustment;
    } else if (currentWeather.temp < 15) { 
        adjustment *= 1.2; 
    }
    

    if (currentWeather.humidity < 40) {
        adjustment *= 0.9;
    } else if (currentWeather.humidity > 70) {
        adjustment *= 1.1;
    }
    
    return Math.round(plantData.waterFrequency * adjustment);
}
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'success') {
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type}`;
    notificationEl.classList.add('show');
    
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, 3000);
}

function loadWeather() {
    updateWeatherDisplay();
}


function updateWeatherDisplay() {
    weatherIconEl.innerHTML = `<i class="fas ${currentWeather.icon}"></i>`;
    temperatureEl.textContent = `${currentWeather.temp}°C`;
    conditionsEl.textContent = currentWeather.conditions;
}

function setupEventListeners() {
   
    updateWeatherBtn.addEventListener('click', () => {
        const location = locationInputEl.value.trim();
        if (location) {
           
            currentWeather.temp = Math.floor(Math.random() * 15) + 15; 
            currentWeather.humidity = Math.floor(Math.random() * 50) + 30; 
            
            const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Rainy"];
            currentWeather.conditions = conditions[Math.floor(Math.random() * conditions.length)];
            
            const icons = {
                "Sunny": "fa-sun",
                "Partly cloudy": "fa-cloud-sun",
                "Cloudy": "fa-cloud",
                "Rainy": "fa-cloud-rain"
            };
            currentWeather.icon = icons[currentWeather.conditions];
            
            updateWeatherDisplay();
            showNotification(`Weather updated for ${location}`);
            

            const activePlant = document.querySelector('.plant-item.active');
            if (activePlant) {
                const plantId = parseInt(activePlant.dataset.id);
                showPlantDetails(plantId);
            }
        } else {
            showNotification('Please enter a location', 'error');
        }
    });
    

    addPlantBtn.addEventListener('click', () => {
        showNotification('Plant addition coming soon!');
    });
    
    locationInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateWeatherBtn.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);