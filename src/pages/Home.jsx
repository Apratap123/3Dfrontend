import React from 'react';
import { Link } from 'react-router-dom';
import { Box, ArrowRight, Shield, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="container page-transition hero-gradient" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--surface)', padding: '8px 16px', borderRadius: '30px', border: '1px solid var(--glass-border)', marginBottom: '30px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>NEW</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience 3D like never before</span>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '25px' }}>
            Visualize Your <span className="gradient-text">3D Creations</span> in Real-Time
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6' }}>
            The ultimate platform for uploading, viewing, and manipulating 3D objects. 
            Secure authentication, persistent view states, and high-performance rendering.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Live Demo
            </Link>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <FeatureCard 
          icon={<Shield size={32} color="var(--primary)" />}
          title="Secure Authentication"
          description="JWT-powered authentication keeps your 3D models and interaction states safe and private."
        />
        <FeatureCard 
          icon={<Layers size={32} color="var(--secondary)" />}
          title="Persistent States"
          description="Save your camera angles, rotations, and zoom levels. We persist your view across sessions."
        />
        <FeatureCard 
          icon={<Zap size={32} color="var(--accent)" />}
          title="Fast Rendering"
          description="Optimized Three.js rendering engine ensures smooth 60FPS interaction for complex GLB files."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-morphism" 
    style={{ padding: '40px', transition: 'all 0.3s' }}
  >
    <div style={{ marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

export default Home;
