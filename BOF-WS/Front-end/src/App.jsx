import { useState, useEffect } from 'react';
import SearchBar from "./components/SearchBar.tsx";
import SearchButton from "./components/SearchButton.tsx";
import Card from "./components/Card.tsx";
import NavMenu from "./components/NavMenu.tsx";

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('feed');
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Состояние для поиска

    const cardsData = [
        {
            external_id: "101",
            title: "Iphone 13",
            price: "26 500",
            images: ["https://example.com/img1.jpg"],
            url: "/product/101",
            date: "2023-10-01",
        }
    ];

    const handleSearch = async (query = "Apple iPhone 13") => {
        setLoading(true);
        setActiveTab('feed');
        setIsSearchOpen(false);
        try {
            const response = await fetch(`http://localhost:8000/api/items?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Ошибка запроса:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    // Скролл вверх при смене вкладки
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center text-white mt-5">
                    <div className="spinner-border text-warning mb-3" style={{width: '3rem', height: '3rem'}}></div>
                    <h3>Ищем на Фарпосте...</h3>
                    <p className="text-secondary small">Это может занять несколько секунд</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'categories':
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
                );
            case 'favorites':
                return (
                    <div className="text-white text-center mt-5">
                        <i className="bi bi-heart text-secondary fs-1"></i>
                        <h2 className="mt-3">Избранное пусто</h2>
                    </div>
                );
            case 'feed':
            default:
                return (
                    <div className="row">
                        {cardsData.map((item) => (
                            <Card
                                key={item.external_id}
                                external_id={item.external_id}
                                title={item.title}
                                price={item.price}
                                images={item.images}
                                url={item.url}
                                date={item.date}
                            />
                        ))}
                        {cardsData.map((item) => (
                            <Card
                                key={item.external_id}
                                external_id={item.external_id}
                                title={item.title}
                                price={item.price}
                                images={item.images}
                                url={item.url}
                                date={item.date}
                            />
                        ))}

                    </div>
                );
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