import React, { useState } from 'react';
import { useFirebase } from '../context/Firebase';
import BarcodeScanner from '../components/BarcodeScanner';

const Details = () => {
    const [pname, setPname] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [coverPic, setCoverPic] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const firebase = useFirebase();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log('Submitted');
        await firebase.handleCreateNewListing(pname, quantity, brand, coverPic);

        setPname('');
        setQuantity('');
        setBrand('');
        setCoverPic(null);
        setSubmitting(false);
    };

    return (
        <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-4 md:space-y-0">

            <div className="md:w-1/2 p-4">
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-3xl text-center mb-6 font-semibold">Barcode Scanner</h1>
                    <BarcodeScanner />
                </div>
            </div>

            <div className="md:w-1/2 p-4">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-3xl text-center mb-6 font-semibold">Enter Product Details</h1>
                    <div className="mb-4">
                        <label htmlFor="pname" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            id="pname"
                            type="text"
                            placeholder="Enter product name"
                            value={pname}
                            onChange={(e) => setPname(e.target.value)}
                            className="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            id="quantity"
                            type="text"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            id="brand"
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                     <div className="mb-6">
                        <label htmlFor="coverPic" className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Pic</label>
                        <input
                            id="coverPic"
                            type="file"
                            onChange={(e) => setCoverPic(e.target.files[0])}
                            className="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div> 
                    <div className="text-center">
                        <button
                            type="submit"
                            className={`bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Details;
