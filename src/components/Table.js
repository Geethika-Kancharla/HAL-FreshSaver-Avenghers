import React from 'react';
import { Trash2, Calendar, Package, Hash } from 'lucide-react';
import { useFirebase } from '../context/Firebase';

const Table = ({ pname, brand, quantity, expiry, id, onItemDelete }) => {
    const firebase = useFirebase();

    const handleDelete = async () => {
        try {
            await firebase.deleteItem(id);
            onItemDelete(id);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const daysUntilExpiry = () => {
        const today = new Date();
        const expiryDate = new Date(expiry);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getBadgeColor = (days) => {
        if (days <= 7) return 'bg-red-100 text-red-800';
        if (days <= 30) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all p-4 shadow-sm hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{pname}</h3>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete item"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Package className="text-gray-400" size={16} />
                            <div>
                                <p className="text-xs text-gray-500">Brand</p>
                                <p className="text-sm font-medium">{brand}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Hash className="text-gray-400" size={16} />
                            <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="text-sm font-medium">{quantity}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={16} />
                            <div>
                                <p className="text-xs text-gray-500">Expiry Date</p>
                                <p className="text-sm font-medium">{expiry}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(daysUntilExpiry())}`}>
                    {daysUntilExpiry()} days until expiry
                </div>
            </div>
        </div>
    );
};

export default Table;