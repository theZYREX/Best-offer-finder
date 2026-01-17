function Demo() {
    return(
        <div className="container d-grid justify-content-center col-11 mb-3">
            <div className="card align-items-center rounded-5">
                    <div className="container mt-2">
                        <div className="row">
                            <div className="col d-flex justify-content-start">
                                <img src="src/assets/Farpost_img.png" className="card-img" alt="" style={{width: 32, height: 26}}/>
                            </div>
                            <div className="col text-center">
                                <h4 className='farpost'>Farpost</h4>
                            </div>
                            <div className="col d-flex justify-content-end">
                                1
                            </div>
                        </div>
                    </div>

                    <div className="card-text d-flex justify-content-center mb-3">
                        <h2>Iphone 13</h2>
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
                                         alt=""/>
                                </div>
                                <div className="carousel-item">
                                    <img src="https://placeholder.apptor.studio/150/150/product1.png" className="card-img"
                                         alt=""/>
                                </div>
                                <div className="carousel-item">
                                    <img src="https://placeholder.apptor.studio/150/150/product1.png" className="card-img"
                                         alt=""/>
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

                        <div className="container row" style={{padding:'0'}}>
                            <div className="col">
                                <h2 className='text-end'> 26 500 ₽</h2>
                            </div>
                            <div className="col-5">
                                <text style={{color: '#1a4013'}} className='btn btn-sm btn-success rounded-5'> отличная цена </text>
                            </div>
                        </div>


                        <p className="card-text">iPhone 13 128гб Состояние-Отличное! Все Родное, в ремонте не был! АКБ-77! Все функции работают отлично( Face ID, TrueTone)!</p>
                        <a href="#" className="btn btn-dark rounded-4 d-flex justify-content-center">
                            <text className="d-flex justify-content-center">
                                Перейти
                            </text>
                        </a>
                    </div>
            </div>
        </div>
    )
}
export default Demo;