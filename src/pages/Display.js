import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/Firebase';
import Table from '../components/Table';
import Recipe from '../components/Recipe';

const Display = () => {
    const [items, setItems] = useState([]);
    const [queriedItems, setQueriedItems] = useState([]);
    const [queriedCategory, setQueriedCategory] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [notifiedItems, setNotifiedItems] = useState([]);
    const firebase = useFirebase();

    const APP_ID = "38eda028";
    const APP_KEY = "f0ce808ed79824c58d8977f482c9b51e";

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

    // start

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

                        // Update notified items state
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
    }, [items, notifiedItems]); // Include notifiedItems in dependency array


    //end

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
                console.log(queriedCategories);
                setQueriedCategory(queriedCategories);

                if (queriedCategories.length > 0) {
                    let recipesArray = [];
                    for (let category of queriedCategories) {
                        const response = await fetch(`https://api.edamam.com/search?q=${category}&app_id=${APP_ID}&app_key=${APP_KEY}`);
                        const data = await response.json();
                        recipesArray = [...recipesArray, ...data.hits];
                    }
                    setRecipes(recipesArray);
                } else {
                    console.log('No categories to fetch recipes for.');
                    setRecipes([]);
                }

                const queriedItems = await firebase.listOnExpiry();
                console.log(queriedItems);
                setQueriedItems(queriedItems);
            } else {
                console.log("User is not authenticated");
            }
        } catch (error) {
            console.error('Error fetching items approaching expiry or categories:', error);
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
        <div className='h-screen w-screen bg-white'>
            <div className='shadow-md'>
                <div className='mt-36'>
                    {queriedItems.length > 0 ? (
                        queriedItems.map((queryItem, index) => (
                            <Table key={index} onItemDelete={handleItemDelete} {...queryItem} />
                        ))
                    ) : (
                        items.map((item, index) => (
                            <Table key={index} onItemDelete={handleItemDelete} {...item.data()} />
                        ))
                    )}
                </div>
                <div className='flex justify-center items-center'>
                    <button onClick={fetchQueriedItems} className='w-fit m-4 bg-blue-200 border border-black text-black'>Filter</button>
                    <button onClick={resetItems} className='w-fit m-4 bg-blue-200 text-black'>Reset</button>
                    <button onClick={fetchCategories} className='w-fit m-4 bg-blue-200 border border-black text-black'>Suggest</button>
                </div>
            </div>
            <div className='bg-white'>
                <h1 className='text-5xl text-center mt-16'>Recipes are here</h1>
                <div className='flex flex-wrap space-x-8 space-y-5 justify-center'>
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <Recipe key={recipe.recipe.label} title={recipe.recipe.label} calories={recipe.recipe.calories} image={recipe.recipe.image} />
                        ))
                    ) : (

                        <p className="text-center mt-4 text-2xl">Click "Suggest" to fetch recipes.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Display;