function CardSkeleton() {
    return (
        <div className="container d-grid justify-content-center col-11 mb-3 col-lg-3">
            <div className="card align-items-center rounded-5 shadow-sm" style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                minHeight: '450px',
                width: '100%'
            }}>
                <div className="w-100 p-3">
                    <div className="skeleton-pulse rounded-3 mb-4" style={{ height: '30px', width: '60%', margin: '0 auto', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="skeleton-pulse rounded-4 mb-3" style={{ height: '200px', width: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="skeleton-pulse rounded-3 mb-2" style={{ height: '20px', width: '90%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="skeleton-pulse rounded-3 mb-4" style={{ height: '20px', width: '70%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="skeleton-pulse rounded-5" style={{ height: '45px', width: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>
            </div>
        </div>
    );
}

export default CardSkeleton;