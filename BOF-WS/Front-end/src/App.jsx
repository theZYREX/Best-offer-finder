import { useState, useEffect } from 'react';
import SearchBar from "./components/SearchBar.tsx";
import SearchButton from "./components/SearchButton.tsx";
import Card from "./components/Card.tsx";
import NavMenu from "./components/NavMenu.tsx";

function App() {
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]); // Состояние для избранного
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('feed');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // 1. Загрузка избранного из LocalStorage при старте
    useEffect(() => {
        const savedFavs = localStorage.getItem('myFavorites');
        if (savedFavs) {
            setFavorites(JSON.parse(savedFavs));
        }
        // Первичная загрузка ленты
        fetchItems();
    }, []);

    // 2. Функция загрузки товаров
    const fetchItems = async (query = "") => {
        setLoading(true);
        try {
            const url = query
                ? `http://localhost:8000/api/items?q=${encodeURIComponent(query)}`
                : 'http://localhost:8000/api/items';

            const response = await fetch(url);
            const data = await response.json();
            setItems(data.items || []);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Логика добавления/удаления из избранного
    const toggleFavorite = (external_id) => {
        // Ищем, есть ли товар уже в избранном (среди favorites или среди текущих items)
        const isAlreadyFav = favorites.some(fav => fav.external_id === external_id);

        let newFavorites;
        if (isAlreadyFav) {
            // Если есть - удаляем
            newFavorites = favorites.filter(fav => fav.external_id !== external_id);
        } else {
            // Если нет - находим товар в общем списке items и добавляем
            const itemToAdd = items.find(item => item.external_id === external_id);
            if (itemToAdd) {
                newFavorites = [...favorites, itemToAdd];
            } else {
                return; // Защита от ошибок
            }
        }

        setFavorites(newFavorites);
        localStorage.setItem('myFavorites', JSON.stringify(newFavorites));
    };

    const handleSearch = (query) => {
        setIsSearchOpen(false);
        setActiveTab('feed'); // При поиске переключаем на ленту
        fetchItems(query);
    };

    // 4. Рендеринг контента в зависимости от вкладки
    const renderContent = () => {
        if (loading && activeTab === 'feed') {
            return (
                <div className="text-center text-white mt-5">
                    <div className="spinner-border text-success" role="status"></div>
                    <p>Загрузка...</p>
                </div>
            );
        }

        if (activeTab === 'categories'){
            return (
                <div className="text-white mt-4">
                    <h2 className="mb-4 fw-bold text-center">Категории</h2>
                    <div className="row g-3">
                        {[
                            { name: 'Электроника', icon: 'bi-cpu' },
                            { name: 'Телефоны', icon: 'bi-phone' },
                            { name: 'Авто', icon: 'bi-car-front' },
                            { name: 'Дом', icon: 'bi-house' }
                        ].map(cat => (
                            <div key={cat.name} className="col-6">
                                <div className="p-4 bg-dark border border-secondary rounded-4 text-center">
                                    <i className={`bi ${cat.icon} fs-2 text-warning`}></i>
                                    <div className="mt-2 small">{cat.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )};

        // Выбираем, какой список показывать: Лента или Избранное
        const displayItems = activeTab === 'favorites' ? favorites : items;

        if (activeTab === 'favorites' && favorites.length === 0) {
            return (
                <div className="text-center text-white mt-5">
                    <i className="bi bi-heart-break fs-1 text-secondary"></i>
                    <h3 className="mt-3">В избранном пусто</h3>
                    <p>Добавляйте товары, нажимая на сердечко ❤️</p>
                </div>
            );
        }

        if (displayItems.length === 0 && !loading) {
            return <div className="text-center text-white mt-5">Ничего не найдено 🤷‍♂️</div>;
        }

        return (
            <div className="row justify-content-center gap-xxl-3 gap-md-2 gap-lg-4">
                {displayItems.map((item) => (
                    <Card
                        key={item.external_id}
                        external_id={item.external_id}
                        title={item.title}
                        price={item.price}
                        url={item.url}
                        date={item.date}
                        image_url={item.image_url}
                        description={item.description}
                        // Передаем состояние: проверяем, есть ли этот конкретный ID в массиве favorites
                        isFavorite={favorites.some(fav => fav.external_id === item.external_id)}
                        onToggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212' }}>
            <main className="container flex-grow-1" style={{ paddingBottom: '110px', paddingTop: '20px' }}>
                {renderContent()}
            </main>

            {isSearchOpen && <SearchBar onSearch={handleSearch} />}

            <div className="bottom-controls-wrapper">
                <NavMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                <SearchButton isOpen={isSearchOpen} onClick={() => setIsSearchOpen(!isSearchOpen)}/>
            </div>
        </div>
    );
}

export default App;