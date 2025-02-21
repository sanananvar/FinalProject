import React from 'react'
import "../../assets/scss/pages/menu.scss";
const drinksData = [
    { name: "Dessert", price: "8.5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVvcpTVxIBggFAEOyoy5dDGkboScI8rdAFA&s" },
    { name: "Dessert", price: "8.5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVvcpTVxIBggFAEOyoy5dDGkboScI8rdAFA&s" },
    { name: "Dessert", price: "8.5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVvcpTVxIBggFAEOyoy5dDGkboScI8rdAFA&s" },
    { name: "Dessert", price: "8.5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVvcpTVxIBggFAEOyoy5dDGkboScI8rdAFA&s" },
 
];
function Dessert() {
    return (
        <div>
            <div className="Dessert-menu">
                <h1 className='title'>Desserts</h1>
                <h2 className="subtitle">Dessert</h2>
                <div className="Dessert-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Dessert-card" key={index}>
                            <div className="Dessert-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet)</p>
                                <p>{drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Dessert-image" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="Dessert-menu">
                <h2 className="subtitle">Diet Dessert</h2>
                <div className="Dessert-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Dessert-card" key={index}>
                            <div className="Dessert-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet)</p>
                                <p> {drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Dessert-image" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="Dessert-menu">
                <h2 className="subtitle">Croissant</h2>
                <div className="Dessert-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Dessert-card" key={index}>
                            <div className="Dessert-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet)</p>
                                <p> {drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Dessert-image" />
                        </div>
                    ))}
                </div>
            </div> <div className="Dessert-menu">
                <h2 className="subtitle">Grab & go </h2>
                <div className="Dessert-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Dessert-card" key={index}>
                            <div className="Dessert-content">
                                <h3>{drink.name}</h3>
                                <p>{drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Dessert-image" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dessert
