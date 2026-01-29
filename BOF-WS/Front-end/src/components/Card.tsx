interface CardProps {
    external_id: string;
    title: string;
    price: number;
    url: string;
    date: string;
    image_url?: string;
    description?: string;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
}

function Card({external_id, title,date, price, url, image_url, description, isFavorite, onToggleFavorite }: CardProps) {
    const imageUrl = image_url
        ? `http://localhost:8000/proxy/image?url=${encodeURIComponent(image_url)}`
        : "https://via.placeholder.com/300?text=No+Image";

    const marketPriceValue = 100000;

    return (
        <div className="container d-grid justify-content-center col-11 mb-3 col-lg-3">
            <div className="card align-items-center rounded-5 shadow-sm">
                <div className="container mt-2">
                    <div className="row">
                        <div className="col d-flex justify-content-start">
                            <img src="/Farpost_img.png" alt="Farpost" style={{ width: 32, height: 26 }} />
                        </div>
                        <div className="col text-center">
                            <h4 className='farpost'>Farpost</h4>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <i
                                className={`bi fs-3 ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary'}`}
                                onClick={() => onToggleFavorite(external_id)}
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            ></i>
                        </div>
                    </div>
                </div>

                <div className="card-text text-center mb-3">
                    <h2>{title}</h2>
                </div>

                <div className="container-fluid col-11">
                    <img
                        src={imageUrl}
                        className="img-fluid rounded-4"
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div className="card-body w-100">
                    <div className="container row" style={{padding: '0', margin: '0'}}>
                        <div className="col">
                            <h2 className='text-end'> {price} ₽</h2>
                        </div>

                        <div className="col">
                            {price < marketPriceValue * 0.9 ? (
                                <span style={{ backgroundColor: '#2e751b', color: 'white' }} className='btn btn-sm rounded-5'>
                                    отличная цена
                                </span>
                            ) : price <= marketPriceValue ? (
                                <span style={{ backgroundColor: '#549e44', color: 'white' }} className='btn btn-sm rounded-5'>
                                    хорошая цена
                                </span>
                            ) : (
                                <span style={{ backgroundColor: '#70a162', color: 'white' }} className='btn btn-sm rounded-5'>
                                    нормальная цена
                                </span>
                            )}
                        </div>
                    </div>


                    <span className="card-text text-break truncate-multi-line">
                        {description || "Описание загружается..."}
                    </span>

                    <p className="card-text d-flex justify-content-end me-3">
                        <small className="text-body-emphasis">{ date }</small>
                    </p>

                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-dark rounded-4 d-flex justify-content-center mt-4">
                        <span className="d-flex justify-content-center">
                            Перейти
                        </span>
                    </a>

                </div>
            </div>
        </div>
    );
}

export default Card;