import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/Firebase';
import Table from '../components/Table';
import Recipe from '../components/Recipe';
import DisplayNavbar from '../components/DisplayNavbar';
import { AlertCircle, ChefHat, Filter, RefreshCw } from 'lucide-react';

const Display = () => {
    const [items, setItems] = useState([]);
    const [queriedItems, setQueriedItems] = useState([]);
    const [queriedCategory, setQueriedCategory] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [notifiedItems, setNotifiedItems] = useState([]);
    const firebase = useFirebase();

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const user = firebase.user;
                if (user) {
                    const allItems = await firebase.listAllItems();
                    setItems(allItems);
                } else {
                    console.log("User is not authenticated");
                }
            } catch (error) {
                console.error('Error fetching all items:', error);
            }
        };

        fetchAllItems();
    }, [firebase]);

    const SPOONACULAR_API_KEY = "8f19f70508cb4981acafc30de3ded9d7";

    useEffect(() => {
        const checkExpiryDates = async () => {
            if (Notification.permission !== 'granted') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.log('Notification permission denied');
                    return;
                }
            }

            const now = new Date();
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

            items.forEach(item => {
                const itemData = item.data();
                if (itemData && itemData.pname && itemData.expiry) {
                    const { id, pname, expiry } = itemData; // Include item id
                    const expiryDate = new Date(expiry);
                    console.log(`Checking item: ${pname}, Expiry Date: ${expiryDate}`);

                    if (expiryDate <= oneMonthFromNow && expiryDate > now && !notifiedItems.includes(id)) {
                        new Notification('Expiry Alert', {
                            body: `${pname} is expiring on ${expiryDate.toDateString()}`,
                            icon: '/path/to/icon.png'
                        });

                        console.log(`Notification sent for item: ${pname}`);

                        setNotifiedItems([...notifiedItems, id]);
                    }
                } else {
                    console.log('Item data is incomplete:', item);
                }
            });
        };

        if (items.length > 0) {
            checkExpiryDates();
        }
    }, [items, notifiedItems]);

    const fetchQueriedItems = async () => {
        try {
            const user = firebase.user;
            if (user) {
                const queriedItems = await firebase.listOnExpiry();
                console.log(queriedItems);
                setQueriedItems(queriedItems);
            } else {
                console.log("User is not authenticated");
            }
        } catch (error) {
            console.error('Error fetching items approaching expiry:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const user = firebase.user;
            if (user) {
                const queriedCategories = await firebase.listCategories();
                console.log("Fetched Categories:", queriedCategories);
                setQueriedCategory(queriedCategories);

                if (queriedCategories.length > 0) {
                    let recipesArray = [];
                    for (let category of queriedCategories) {
                        console.log(`Fetching recipes for category: ${category}`);

                        const response = await fetch(
                            `https://api.spoonacular.com/recipes/complexSearch?query=${category}&cuisine=Indian&apiKey=${SPOONACULAR_API_KEY}&number=10`
                        );
                        const data = await response.json();

                        if (data.results && data.results.length > 0) {
                            recipesArray = [...recipesArray, ...data.results];
                            console.log(`Recipes found for category: ${category}`);
                        } else {
                            console.log(`No recipes found for category: ${category}`);
                        }
                    }
                    setRecipes(recipesArray);
                } else {
                    console.log('No categories found to fetch recipes.');
                    setRecipes([]);
                }
            } else {
                console.log("User is not authenticated");
            }
        } catch (error) {
            console.error('Error fetching category-based recipes:', error);
        }
    };
    

    const resetItems = () => {
        setQueriedItems([]);
        setRecipes([]);
        setNotifiedItems([]);
    };

    const handleItemDelete = (deletedItemId) => {
        setItems(items.filter(item => item.id !== deletedItemId));
    };
    
   
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <DisplayNavbar />
            
            <div className="pt-12 px-4 md:px-8 pb-8"> 
                <div className="max-w-7xl mx-auto space-y-8">
         
                    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={fetchQueriedItems}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                        >
                            <Filter size={20} />
                            Expiring Soon
                        </button>
                        <button 
                            onClick={resetItems}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                        >
                            <RefreshCw size={20} />
                            Reset View
                        </button>
                        <button 
                            onClick={fetchCategories}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                        >
                            <ChefHat size={20} />
                            Find Recipes
                        </button>
                    </div>

                    {/* Inventory Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <AlertCircle className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-semibold text-gray-800">Current Inventory</h2>
                        </div>
                        <div className="space-y-4">
                            {queriedItems.length > 0
                                ? queriedItems.map((queryItem, index) => (
                                    <Table key={index} onItemDelete={handleItemDelete} {...queryItem} />
                                ))
                                : items.map((item, index) => (
                                    <Table key={index} onItemDelete={handleItemDelete} {...item.data()} />
                                ))}
                        </div>
                    </div>

                    {/* Recipe Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 border-b pb-4 mb-6">
                            <ChefHat className="text-green-600" size={24} />
                            <h2 className="text-2xl font-semibold text-gray-800">Recommended Recipes</h2>
                        </div>
                        {recipes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recipes.map(recipe => (
                                    <Recipe 
                                        key={recipe.id}
                                        title={recipe.title}
                                        image={recipe.image}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-600">
                                <ChefHat size={48} className="mx-auto mb-4 text-gray-400" />
                                <p>Click "Find Recipes" to get personalized recommendations based on your inventory</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Display;
