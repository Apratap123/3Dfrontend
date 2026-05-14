import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Viewer3D from '../components/Viewer3D';
import { Upload, Plus, Trash2, Box as BoxIcon, Eye, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObjects();
  }, []);

  const fetchObjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/objects`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setObjects(res.data);
      if (res.data.length > 0 && !selectedObject) {
        setSelectedObject(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching objects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('name', uploadName || uploadFile.name);

    try {
      const res = await axios.post(`${API_BASE}/objects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      setObjects([res.data, ...objects]);
      setSelectedObject(res.data);
      setUploadFile(null);
      setUploadName('');
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveState = async (id, state) => {
    try {
      await axios.put(`${API_BASE}/objects/${id}/state`, { interactionState: state }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setObjects(objects.map(obj => obj._id === id ? { ...obj, interactionState: state } : obj));
    } catch (err) {
      console.error('Error saving state', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    try {
      await axios.delete(`${API_BASE}/objects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const newObjects = objects.filter(obj => obj._id !== id);
      setObjects(newObjects);
      if (selectedObject?._id === id) {
        setSelectedObject(newObjects[0] || null);
      }
    } catch (err) {
      console.error('Error deleting object', err);
    }
  };

  return (
    <div className="container page-transition" style={{ height: 'calc(100vh - 120px)', paddingBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: '100%' }}>

        <div className="glass-morphism" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>My Models</h2>
            <div style={{ padding: '4px 8px', background: 'var(--primary)', borderRadius: '12px', fontSize: '0.7rem' }}>{objects.length}</div>
          </div>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative', height: '80px', border: '2px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
              <input
                type="file"
                accept=".glb,.gltf"
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                onChange={(e) => {
                  setUploadFile(e.target.files[0]);
                  setUploadName(e.target.files[0]?.name.split('.')[0] || '');
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <Upload size={20} color="var(--text-muted)" style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{uploadFile ? uploadFile.name : 'Click to upload .GLB'}</div>
              </div>
            </div>
            {uploadFile && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <input
                  type="text"
                  placeholder="Object name"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                />
                <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </motion.div>
            )}
          </form>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading models...</div>
            ) : objects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <BoxIcon size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>No models yet. Upload your first GLB file!</p>
              </div>
            ) : (
              objects.map(obj => (
                <div
                  key={obj._id}
                  onClick={() => setSelectedObject(obj)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: selectedObject?._id === obj._id ? 'var(--surface-hover)' : 'var(--surface)',
                    border: `1px solid ${selectedObject?._id === obj._id ? 'var(--primary)' : 'transparent'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BoxIcon size={20} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{obj.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(obj.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(obj._id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-morphism" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedObject ? (
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '8px 16px', background: 'var(--glass)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1rem' }}>{selectedObject.name}</h3>
                </div>
              </div>

              <Viewer3D
                key={selectedObject._id}
                fileUrl={`${import.meta.env.VITE_API_BASE_URL}${selectedObject.fileUrl}`}
                interactionState={selectedObject.interactionState}
                onSaveState={(state) => handleSaveState(selectedObject._id, state)}
              />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', color: 'var(--text-muted)' }}>
              <BoxIcon size={80} style={{ opacity: 0.2 }} />
              <h3>Select a model to visualize</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
