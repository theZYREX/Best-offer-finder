import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSearch(text);
            setText("");
        }
    };

    return (
        <div className="glass-search-bar-container">
            <form className="glass-search-form" onSubmit={handleSubmit}>
                <i className="bi bi-search text-white opacity-50 me-2"></i>
                <input
                    type="search"
                    className="glass-input"
                    placeholder="Поиск по объявлениям..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                />
            </form>
        </div>
    );
}

export default SearchBar;