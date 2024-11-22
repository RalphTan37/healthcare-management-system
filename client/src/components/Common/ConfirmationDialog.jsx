import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>Confirm Action</h3>
        <div className="dialog-message">
          {message}
        </div>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="btn primary">Confirm</button>
          <button onClick={onCancel} className="btn secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;