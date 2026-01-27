import { useState, useRef } from 'react';

interface NavMenuProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function NavMenu({ activeTab, setActiveTab }: NavMenuProps) {
    const menuItems = [
        { id: 'categories', label: 'Категории', icon: 'bi-grid', activeIcon: 'bi-grid-fill ' },
        { id: 'feed', label: 'Лента', icon: 'bi-house', activeIcon: 'bi-house-fill' },
        { id: 'favorites', label: 'Избранное', icon: 'bi-heart', activeIcon: 'bi-heart-fill' },
    ];

    const activeIndex = menuItems.map(item => item.id).indexOf(activeTab);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startXRef = useRef<number>(0);
    const dockRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        startXRef.current = e.clientX;
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const currentX = e.clientX;
        let diff = currentX - startXRef.current;
        if (activeIndex === 0) {
            diff = Math.max(0, diff);
        }
        if (activeIndex === menuItems.length - 1) {
            diff = Math.min(0, diff);
        }
        setDragOffset(diff);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);

        const threshold = 40;

        if (dragOffset > threshold && activeIndex < menuItems.length - 1) {
            setActiveTab(menuItems[activeIndex + 1].id);
        } else if (dragOffset < -threshold && activeIndex > 0) {
            setActiveTab(menuItems[activeIndex - 1].id);
        }
        setDragOffset(0);
    };

    return (
        <div className="dock-container">
            <div
                className="liquid-glass-dock"
                ref={dockRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div
                    className="dock-indicator"
                    style={{
                        transform: `translateX(calc(${activeIndex * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}>
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`dock-item ${activeTab === item.id ? 'active' : ''}`}
                        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                        <i className={`bi ${activeTab === item.id ? item.activeIcon : item.icon}`}></i>
                        <span className="dock-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default NavMenu;