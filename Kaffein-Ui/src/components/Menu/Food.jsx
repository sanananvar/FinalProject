import React from "react";
import "../../assets/scss/pages/menu.scss";
const drinksData = [
    { name: "Merry Pop Latte", price: "8.5", imageUrl: "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=" },
    { name: "Crispy Nut Latte", price: "8.0", imageUrl: "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=" },
    { name: "Gold Flake Raf", price: "8.0", imageUrl: "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=" },
    { name: "GLÜhwein (non-alcoholic)", price: "7.0", imageUrl: "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=" },
    { name: "Immuni Tea", price: "7.0", imageUrl: "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=" },
];

const Food = () => {
    return (
        <>
            <div className="Food-menu">
                <h1 className="title">Food</h1>
                <h2 className="subtitle">Sandwich</h2>
                <div className="Food-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Food-card" key={index}>
                            <div className="Food-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet.)</p>
                                <p>{drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Food-image" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="Food-menu">
                <h2 className="subtitle">Toast</h2>
                <div className="Food-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Food-card" key={index}>
                            <div className="Food-content">
                                <h3>{drink.name}</h3>
                                <p className="Food-description">(Lorem ipsum dolor sit amet.)</p>
                                <p> {drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Food-image" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="Food-menu">
                <h2 className="subtitle">Roll</h2>
                <div className="Food-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Food-card" key={index}>
                            <div className="Food-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet.)</p>
                                <p>{drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Food-image" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="Food-menu">
                <h2 className="subtitle">Salad & Bowl</h2>
                <div className="Food-grid">
                    {drinksData.map((drink, index) => (
                        <div className="Food-card" key={index}>
                            <div className="Food-content">
                                <h3>{drink.name}</h3>
                                <p className="food-description">(Lorem ipsum dolor sit amet.)</p>
                                <p> {drink.price} ₼</p>
                            </div>
                            <img src={drink.imageUrl} alt={drink.name} className="Food-image" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Food;
