import React from 'react'

const Recipe = ({ title, calories, image }) => {
    return (
        <div className="display-recipe">
            <img src={image} alt={title} />
            <div className="display-recipe-content">
                <h2 className="display-title">{title}</h2>
                <p className="display-text">
                    {Math.round(calories)} calories
                </p>
            </div>
        </div>
    );
};

export default Recipe