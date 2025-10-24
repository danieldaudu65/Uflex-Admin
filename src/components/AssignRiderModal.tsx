// src/components/AssignRiderModal.tsx
import React, { useEffect, useState } from 'react';
import ModalWrapper from './modalParent';
import { apiRequest } from '../utils/api';
import toast from 'react-hot-toast';

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  vehicle?: string;
  is_active?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onAssigned: (bookingId: string, rider: Rider) => void; // callback to refresh parent
}

const AssignRiderModal: React.FC<Props> = ({ isOpen, onClose, bookingId, onAssigned }) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRiders = async () => {
      setFetching(true);
      try {
        const res = await apiRequest('/admin_dashboard/all_riders', 'GET');
        if (res.success) setRiders(res.riders || []);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to load riders');
      } finally {
        setFetching(false);
      }
    };
    fetchRiders();
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selected) return toast.error('Select a rider first');
    setLoading(true);
    try {
      const res = await apiRequest('/admin_dashboard/assign_rider', 'POST', {
        bookingId,
        riderId: selected
      });
      if (res.success) {
        toast.success(res.message || 'Rider assigned');
        onAssigned(bookingId, res.rider);
        onClose();
      } else {
        toast.error(res.message || 'Failed to assign');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to assign rider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-4 bg-white m-4 rounded-lg py-8">
        <h3 className="text-lg font-bold mb-3">Assign Rider</h3>
        {fetching ? (
          <p>Loading riders...</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {riders.map((r) => (
              <label key={r._id} className="flex items-center justify-between p-2 border border-gray-300 rounded">
                <div>
                  <div className="font-medium">{r.firstName} {r.lastName}</div>
                  <div className="text-xs text-gray-500">{r.vehicle || ''} {r.email ? `• ${r.email}` : ''}</div>
                </div>
                <input
                  type="radio"
                  name="selectedRider"
                  checked={selected === r._id}
                  onChange={() => setSelected(r._id)}
                  value={r._id}
                />
              </label>
            ))}
            {riders.length === 0 && <p className="text-sm text-gray-500">No riders found</p>}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleAssign} className="px-4 py-2 bg-[#65CE00] rounded text-black font-bold" disabled={loading}>
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AssignRiderModal;
