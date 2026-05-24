import { FiX } from 'react-icons/fi';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirm', isDanger = false }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition font-medium text-white ${
              isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
