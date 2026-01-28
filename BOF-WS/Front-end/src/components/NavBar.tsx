function NavBar() {
    return(
        <header className="mt-3">
            <div className="container-fluid d-grid  align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                    <form className="col-9 col-lg-5 mb-3 mb-lg-3" role="search">
                        <input type="search" className="form-control form-control-dark text-bg-dark rounded-4 shadow-none" placeholder="" aria-label="Search" />
                    </form>
                </div>
            </div>
        </header>
    )
}

export default NavBar;
