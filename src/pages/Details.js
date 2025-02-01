import React, { useState } from 'react';
import { useFirebase } from '../context/Firebase';
import BarcodeScanner from '../components/BarcodeScanner';
import { Upload, Package, Barcode, Tag } from 'lucide-react';
import DetailNavbar from '../components/DetailNavbar';

const Details = () => {
    const [pname, setPname] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [coverPic, setCoverPic] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [category, setCategory] = useState('');

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <DetailNavbar />
            
            <div className="pt-24 px-4 md:px-8 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                    
                        <div className="md:w-1/2">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 border-b pb-4 mb-6">
                                    <Barcode className="text-blue-600" size={24} />
                                    <h2 className="text-2xl font-semibold text-gray-800">Scan Barcode</h2>
                                </div>
                                <BarcodeScanner />
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 border-b pb-4 mb-6">
                                    <Package className="text-green-600" size={24} />
                                    <h2 className="text-2xl font-semibold text-gray-800">Product Details</h2>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="pname" className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name
                                        </label>
                                        <input
                                            id="pname"
                                            type="text"
                                            placeholder="Enter product name"
                                            value={pname}
                                            onChange={(e) => setPname(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            id="quantity"
                                            type="text"
                                            placeholder="Enter quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} />
                                                <span>Brand</span>
                                            </div>
                                        </label>
                                        <input
                                            id="brand"
                                            type="text"
                                            placeholder="Enter brand"
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center gap-2">
                                           
                                                <span>Category</span>
                                            </div>
                                        </label>
                                        <input
                                            id="category"
                                            type="text"
                                            placeholder="Enter category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* <div>
                                        <label htmlFor="coverPic" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} />
                                                <span>Upload Cover Picture</span>
                                            </div>
                                        </label>
                                        <input
                                            id="coverPic"
                                            type="file"
                                            onChange={(e) => setCoverPic(e.target.files[0])}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div> */}

                                    <div className="flex justify-center pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`
                                                flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                                                transition-all transform hover:scale-105
                                                ${submitting 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                                }
                                            `}
                                        >
                                            <Package size={20} />
                                            {submitting ? 'Submitting...' : 'Add Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
