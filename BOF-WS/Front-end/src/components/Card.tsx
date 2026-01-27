interface CardProps {
    external_id: string;
    title: string;
    price: number;
    market_price: number;
    images: string[];
    url: string;
    date: string;
}

function Card({ external_id, title, price, market_price, images, url, date }: CardProps) {
    const carouselId = `carousel-${external_id}`;

    const marketPriceValue = 100000;
    return (
        <div className="container d-grid justify-content-center col-12 mb-3  col-lg-3">
            <div className="card align-items-center rounded-5">
                <div className="container mt-2">
                    <div className="row">
                        <div className="col d-flex justify-content-start">
                            <img src="src/assets/Farpost_img.png" className="card-img" alt="" style={{ width: 32, height: 26 }} />
                        </div>
                        <div className="col text-center">
                            <h4 className='farpost'>Farpost</h4>
                        </div>
                        <div className="col d-flex justify-content-end">
                            {external_id}
                        </div>
                    </div>
                </div>

                <div className="card-text text-center mb-3">
                    <h2>{title}</h2>
                </div>

                <div className="container-fluid col-11">
                    <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                    className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                    aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                                    aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://placeholder.apptor.studio/150/150/product1.png" className="card-img"
                                     alt="" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://placeholder.apptor.studio/150/150/product1.png" className="card-img"
                                     alt="" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://placeholder.apptor.studio/150/150/product1.png" className="card-img"
                                     alt="" />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="container row" style={{padding: '0', margin: '0'}}>
                        <div className="col">
                            <h2 className='text-end'> {price} ₽</h2>
                        </div>

                        <div className="col-5 mt-1">
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
                        iPhone 13 128гб Состояние-Отличное! Все Родное, в ремонте не был! АКБ-77! Все функции работают отлично( Face ID, TrueTone)!
                    </span>
                    <p className="card-text d-flex justify-content-end me-3">
                        <small className="text-body-emphasis">{date}</small>
                    </p>
                    <a href={url} className="btn btn-dark rounded-4 d-flex justify-content-center">
                        <span className="d-flex justify-content-center">
                            Перейти
                        </span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Card;