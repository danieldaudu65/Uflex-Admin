import React, { useState } from 'react';
import ModalWrapper from './modalParent';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    adminId: string;
    currentRole: string;
    refresh: () => void; // add refresh prop

}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, refresh, adminId, currentRole }) => {
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);

    const handleUpdateRole = async () => {
        setLoading(true);
        try {
            const res = await apiRequest(`/admin_admin/edit-role`, 'PUT', { id: adminId, role });
            if (res.success) {
                if (res.success) {
                    toast.success('Role updated successfully');
                    refresh();
                    onClose();
                }
            }
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        setLoading(true);
        try {
            const res = await apiRequest(`/admin_admin/deactivate`, 'PUT', { id: adminId });
            if (res.success) {
                toast.success('Admin deactivated successfully');
                refresh();
                onClose();

            }
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to deactivate admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className='bg-white p-4 m-4 rounded-lg'>
                <h2 className="font-bold text-lg mb-4">Edit Admin Role</h2>

                <div className="flex flex-col gap-3 mb-4">
                    <label className="font-semibold">Select Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border border-gray-400 rounded p-2"
                    >
                        <option value="master" className='border-gray-400 '>Master</option>
                        <option value="standard" className='border-gray-400 '>Standard</option>
                    </select>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleDeactivate}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        Deactivate
                    </button>
                    <button
                        onClick={handleUpdateRole}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        Save
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default RoleModal;
