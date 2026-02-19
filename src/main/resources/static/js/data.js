// js/data.js — общие данные для всего сайта

const bouquets = [
    {
        id: 1,
        name: "Невеста",
        category: "wedding",
        description: "Белые пионы, розы, эвкалипт",
        price: 5000,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/b2/96/77/b2967780076aac925b6c4a7398be6788.jpg",
        rating: 5,
        reviews: 12,
        popularity: 92
    },
    {
        id: 2,
        name: "Элегантность",
        category: "wedding",
        description: "Белые розы, гортензии",
        price: 4200,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/c4/ae/f0/c4aef06a3a32c70ce1ed75271ab1d3e5.jpg",
        rating: 4.8,
        reviews: 8,
        popularity: 78
    },
    {
        id: 3,
        name: "Романтический букет",
        category: "romantic",
        description: "Нежные розы и пионы в элегантной упаковке",
        price: 3500,
        oldPrice: 4200,
        image: "https://i.pinimg.com/736x/97/78/33/9778339cf8a1e1e1851e6b6ed4ce81c6.jpg",
        rating: 4.5,
        reviews: 24,
        popularity: 95
    },
    {
        id: 4,
        name: "Радость",
        category: "birthday",
        description: "Яркие герберы и хризантемы",
        price: 3200,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/c3/e2/60/c3e26031a5be296b2db4df0cbe002d74.jpg",
        rating: 4.2,
        reviews: 7,
        popularity: 65
    },
    {
        id: 5,
        name: "Праздник",
        category: "birthday",
        description: "Ранункулюсы, тюльпаны и гиацинты",
        price: 4800,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/1b/d5/bc/1bd5bca8f6efdfcee2b1c03e0906dc40.jpg",
        rating: 5,
        reviews: 10,
        popularity: 82
    },
    {
        id: 6,
        name: "Любимой",
        category: "romantic",
        description: "Красные розы, гипсофила",
        price: 3200,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/03/93/d7/0393d78272a9a765b7520dcb59154c57.jpg",
        rating: 4.9,
        reviews: 24,
        popularity: 88
    },
    {
        id: 7,
        name: "Нежность",
        category: "romantic",
        description: "Розы, пионы, эвкалипт",
        price: 3500,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/1a/4f/69/1a4f691a708ad3a6c7a5681aa8a183e4.jpg",
        rating: 4.7,
        reviews: 18,
        popularity: 79
    },
    {
        id: 10,
        name: "Весеннее настроение",
        category: "spring",
        description: "Яркие тюльпаны и гиацинты в корзине",
        price: 2800,
        oldPrice: null,
        image: "https://i.pinimg.com/736x/48/8b/9b/488b9b95779fdf4cf9a10121874ee0e2.jpg",
        rating: 4.3,
        reviews: 18,
        popularity: 70
    },
    // Добавьте ещё 10–20 букетов по желанию
];

const teamMembers = [
    {
        name: "Анна Смирнова",
        role: "Главный флорист",
        bio: "Более 12 лет в профессии. Специализируется на свадебной и статусной флористике.",
        photo: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Мария Ковалёва",
        role: "Флорист-дизайнер",
        bio: "Любит экспериментировать с необычными сочетаниями и сезонными цветами.",
        photo: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        name: "Екатерина Иванова",
        role: "Мастер по сборке букетов",
        bio: "Создаёт самые нежные и романтичные композиции.",
        photo: "https://randomuser.me/api/portraits/women/65.jpg"
    }
    // можно добавить ещё
];

window.bouquets = bouquets;
window.teamMembers = teamMembers;