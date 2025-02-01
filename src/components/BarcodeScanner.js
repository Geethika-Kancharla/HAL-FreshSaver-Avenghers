import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';
import axios from 'axios';
import { useFirebase } from '../context/Firebase';

const BarcodeScanner = () => {
    const firebase = useFirebase();
    const webcamRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState('Scanning for barcodes...');
    const [expiry, setExpiry] = useState('');
    const [category, setCategory] = useState('');

    const handleBarcodeDetected = (result) => {
        if (result && result.codeResult && result.codeResult.code) {
            setStatus(`Barcode detected: ${result.codeResult.code}`);
            fetchProductDetails(result.codeResult.code);
            Quagga.offDetected(handleBarcodeDetected);
        }
    };

    const handleStore = () => {

        if (product) {

            firebase.handleCreateNewListing(
                product.name,
                product.quantity,
                product.brand,
                product.imageUrl,
                expiry,
                category
            );
            setStatus('Product stored successfully in Firebase.');
            setProduct(null);
        } else {
            setStatus('No product details to store.');
        }
    };

    const fetchProductDetails = async (barcode) => {
        try {
            const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            console.log('API Response:', response.data);
            if (response.data.status === 1) {
                const productData = response.data.product;
                console.log('Product Data:', productData);
                setProduct({
                    name: productData.product_name || 'N/A',
                    brand: productData.brands || 'N/A',
                    quantity: productData.quantity || 'N/A',
                    imageUrl: productData.image_url || null,
                });
                setStatus('Product details fetched successfully.');
            } else {
                setStatus('Product not found.');
            }
        } catch (error) {
            console.error('API Error:', error);
            setStatus('Failed to fetch product details.');
        }
    };

    useEffect(() => {
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: webcamRef.current.video,
                constraints: {
                    facingMode: 'environment',
                },
            },
            decoder: {
                readers: ['ean_reader'],
            },
        }, (err) => {
            if (err) {
                console.error(err);
                setStatus('Failed to initialize barcode scanner.');
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(handleBarcodeDetected);

        return () => {
            Quagga.stop();
        };
    }, []);

    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Barcode Scanner</h2>
            <div className="relative w-full aspect-w-16 aspect-h-9 mb-4">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded-md shadow-md"
                />
            </div>
            <p className="mb-2"><strong>Status:</strong> {status}</p>
            {product && (
                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                    <div className="mb-4">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-41 object-cover rounded-lg shadow-md"
                                style={{ maxHeight: '300px' }}
                            />
                        ) : (
                            <p className="italic">No image available</p>
                        )}
                    </div>
                    <div className='flex flex-col space-y-4'>
                        <p className='text-2xl'><strong className='mt-2 font-bold text-xl'>Name:</strong> {product.name}</p>
                        <p className='text-2xl'><strong className='mt-2 font-bold text-xl'>Brand:</strong> {product.brand}</p>
                        <p className='text-2xl'><strong className='mt-2 font-bold text-xl'>Quantity:</strong> {product.quantity}</p>
                    </div>
                    <div className='flex flex-col space-y-3'>
                        <label className='mt-6 font-bold text-xl'>Expiry Date :</label>
                        <input
                            type="date"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="border border-gray-300 rounded-sm p-6 text-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className='mt-6 font-bold text-xl'>Category :</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-6"
                            placeholder='Enter the Category'
                        />
                    </div>
                    <button
                        onClick={handleStore}
                        className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-green-500 w-fit"
                    >
                        Store
                    </button>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
