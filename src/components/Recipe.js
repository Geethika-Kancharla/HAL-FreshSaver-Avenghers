import React, { useState } from 'react';
import RecipeModal from './RecipeModal';

const Recipe = ({ title, image }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {title}
                    </h3>
                </div>
            </div>

            <RecipeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                recipe={{ title, image }}
            />
        </>
    );
};

export default Recipe;