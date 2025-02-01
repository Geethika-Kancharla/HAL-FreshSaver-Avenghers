import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getRecipeInstructions } from '../utils/gemini';

const formatInstructions = (text) => {
    return text.split('\n').map((line, index) => {
        // Section headers with emojis
        if (line.match(/^[🥘⏲️📝🍽️]/)) {
            return (
                <h3 key={index} className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">
                    {line.trim()}
                </h3>
            );
        }
        // Bullet points
        if (line.trim().startsWith('•')) {
            return (
                <li key={index} className="ml-6 mb-2 text-gray-600 list-disc">
                    {line.replace('•', '').trim()}
                </li>
            );
        }
        // Numbered steps
        if (line.trim().match(/^\d+\./)) {
            return (
                <li key={index} className="ml-6 mb-4 text-gray-600 list-decimal">
                    {line.trim()}
                </li>
            );
        }
        // Regular text
        return line.trim() && (
            <p key={index} className="mb-2 text-gray-600">
                {line}
            </p>
        );
    });
};

const RecipeModal = ({ isOpen, onClose, recipe }) => {
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchInstructions = async () => {
        if (!instructions) {
            setLoading(true);
            const generatedInstructions = await getRecipeInstructions(recipe.title);
            setInstructions(generatedInstructions);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-lg mb-6"
                    />

                    {!instructions && !loading && (
                        <button
                            onClick={fetchInstructions}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Get Cooking Instructions
                        </button>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="ml-2">Generating instructions...</span>
                        </div>
                    )}

                    {instructions && (
                        <div className="prose max-w-none">
                            {formatInstructions(instructions)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeModal; 