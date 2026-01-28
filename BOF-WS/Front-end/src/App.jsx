import { useState, useEffect } from 'react';
import SearchBar from "./components/SearchBar.tsx";
import SearchButton from "./components/SearchButton.tsx";
import Card from "./components/Card.tsx";
import NavMenu from "./components/NavMenu.tsx";

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Функция загрузки данных
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
            console.error("Ошибка запроса к бэкенду:", error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка при первом запуске
    useEffect(() => {
        fetchItems();
    }, []);

    const handleSearch = (query) => {
        setIsSearchOpen(false);
        fetchItems(query);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center mt-5 text-white">
                    <div className="spinner-border text-success" role="status"></div>
                    <p className="mt-2">Ищем лучшие предложения...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'feed':
                return (
                    <div className="row justify-content-center">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <Card
                                    key={item.external_id}
                                    external_id={item.external_id}
                                    title={item.title}
                                    price={item.price}
                                    url={item.url}
                                    date={item.date}
                                    image_url={item.image_url}
                                    description={item.description}
                                />
                            ))
                        ) : (
                            <div className="text-center text-white mt-5">
                                <h5>Ничего не найдено 🧐</h5>
                                <p>Попробуйте изменить запрос</p>
                            </div>
                        )}
                    </div>
                );
            case 'favorites':
                return <div className="text-center text-white mt-5">Пока тут пусто ❤️</div>;
            case 'profile':
                return <div className="text-center text-white mt-5">Настройки профиля</div>;
            default:
                return null;
        }
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