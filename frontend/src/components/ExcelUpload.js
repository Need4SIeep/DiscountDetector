import React, { useState } from 'react';
import axios from 'axios';
import './ExcelUpload.css';

function ExcelUpload({ onUploadSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Check if there were errors
      if (response.data.inserted === 0 && response.data.errors) {
        setError('⚠️ No items imported. Issues:\n' + response.data.errors.slice(0, 5).join('\n'));
        return;
      }
      
      let successMsg = `✓ Successfully imported ${response.data.inserted} items`;
      if (response.data.errors && response.data.errors.length > 0) {
        successMsg += `\n⚠️ ${response.data.errors.length} rows skipped (see details below)`;
      }
      setMessage(successMsg);
      
      // Show first few errors for debugging
      if (response.data.errors && response.data.errors.length > 0) {
        console.log('Import errors:', response.data.errors);
      }
      
      setFile(null);
      setTimeout(() => {
        setIsOpen(false);
        if (response.data.inserted > 0 && onUploadSuccess) onUploadSuccess();
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Upload failed';
      const details = err.response?.data?.details;
      setError(`${errorMsg}${details ? '\n' + details : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upload Button */}
      <button 
        className="excel-upload-btn"
        onClick={() => setIsOpen(true)}
        title="Import Excel file"
      >
        📥 Import
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Import from Excel</h2>
              <button 
                className="close-btn" 
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="instructions">
                Upload your Excel file with columns: Article, Brand, Price, Quantity, Unit, PurchaseDate, Notes
              </p>
              
              <form onSubmit={handleUpload}>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={loading}
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="file-label">
                    {file ? `📄 ${file.name}` : '📁 Choose Excel file...'}
                  </label>
                </div>

                <button type="submit" disabled={loading || !file} className="submit-btn">
                  {loading ? 'Importing...' : 'Import Excel'}
                </button>
              </form>

              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExcelUpload;
