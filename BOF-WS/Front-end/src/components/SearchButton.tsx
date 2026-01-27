interface SearchButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

function SearchButton({ onClick, isOpen }: SearchButtonProps) {
    return (
        <button
            className={`glass-search-btn  ${isOpen ? 'active' : ''}`} onClick={onClick}>
            {isOpen ? (
                <i className="bi bi-x-lg" style={{fontSize: '1.2rem'}}></i>
            ) : (
                <i className="bi bi-search" style={{fontSize: '1.2rem'}}></i>
            )}
        </button>
    );
}

export default SearchButton;