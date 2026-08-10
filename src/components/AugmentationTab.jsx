import React, { useState, useRef, useEffect } from 'react';
import { Sliders, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function AugmentationTab() {
  const [rotation, setRotation] = useState(15);
  const [zoom, setZoom] = useState(1.1);
  const [brightness, setBrightness] = useState(110);
  const [contrast, setContrast] = useState(120);
  const [hFlip, setHFlip] = useState(false);
  const [vFlip, setVFlip] = useState(false);
  const [noise, setNoise] = useState(10);

  const canvasRefOrig = useRef(null);
  const canvasRefAug = useRef(null);

  useEffect(() => {
    const width = 200;
    const height = 200;

    const ctxOrig = canvasRefOrig.current.getContext('2d');
    const ctxAug = canvasRefAug.current.getContext('2d');

    canvasRefOrig.current.width = width;
    canvasRefOrig.current.height = height;
    canvasRefAug.current.width = width;
    canvasRefAug.current.height = height;

    // Draw reference leaf sample on original canvas
    const drawBaseImage = (ctx) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Leaf stem
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(100, 180);
      ctx.quadraticCurveTo(90, 110, 100, 30);
      ctx.stroke();

      // Leaf body
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(100, 100, 45, 65, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();

      // Disease spots
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(85, 80, 10, 0, Math.PI * 2);
      ctx.arc(115, 110, 14, 0, Math.PI * 2);
      ctx.arc(95, 135, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    drawBaseImage(ctxOrig);

    // Render Augmented Canvas with transformations
    ctxAug.save();
    ctxAug.fillStyle = '#0f172a';
    ctxAug.fillRect(0, 0, width, height);

    // Apply Filters: Brightness & Contrast
    ctxAug.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Apply Geometric Transformations around Center
    ctxAug.translate(width / 2, height / 2);
    ctxAug.rotate((rotation * Math.PI) / 180);
    ctxAug.scale(
      (hFlip ? -1 : 1) * zoom, 
      (vFlip ? -1 : 1) * zoom
    );
    ctxAug.translate(-width / 2, -height / 2);

    drawBaseImage(ctxAug);
    ctxAug.restore();

    // Add Gaussian Noise Overlay if enabled
    if (noise > 0) {
      const imgData = ctxAug.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const rnd = (Math.random() - 0.5) * noise * 3;
        data[i] = Math.min(255, Math.max(0, data[i] + rnd));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + rnd));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + rnd));
      }
      ctxAug.putImageData(imgData, 0, 0);
    }

  }, [rotation, zoom, brightness, contrast, hFlip, vFlip, noise]);

  const handleReset = () => {
    setRotation(0);
    setZoom(1.0);
    setBrightness(100);
    setContrast(100);
    setHFlip(false);
    setVFlip(false);
    setNoise(0);
  };

  return (
    <div className="grid-2">
      {/* Left Column: Interactive Controls */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={20} />
            Data Augmentation Controls
          </div>
          <button 
            className="btn btn-secondary"
            onClick={handleReset}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        <div className="control-group">
          <label className="control-label">
            <span>Random Rotation (°):</span>
            <span style={{ color: 'var(--primary)' }}>{rotation}°</span>
          </label>
          <input 
            type="range" min="-180" max="180" 
            value={rotation} 
            onChange={(e) => setRotation(Number(e.target.value))} 
            className="control-slider" 
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span>Random Zoom / Scale:</span>
            <span style={{ color: 'var(--secondary)' }}>{zoom.toFixed(2)}x</span>
          </label>
          <input 
            type="range" min="0.5" max="2.0" step="0.05" 
            value={zoom} 
            onChange={(e) => setZoom(Number(e.target.value))} 
            className="control-slider" 
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span>Color Jitter - Brightness:</span>
            <span style={{ color: 'var(--accent)' }}>{brightness}%</span>
          </label>
          <input 
            type="range" min="50" max="180" 
            value={brightness} 
            onChange={(e) => setBrightness(Number(e.target.value))} 
            className="control-slider" 
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span>Color Jitter - Contrast:</span>
            <span style={{ color: 'var(--accent)' }}>{contrast}%</span>
          </label>
          <input 
            type="range" min="50" max="180" 
            value={contrast} 
            onChange={(e) => setContrast(Number(e.target.value))} 
            className="control-slider" 
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span>Gaussian Noise Injection:</span>
            <span style={{ color: 'var(--secondary)' }}>{noise}%</span>
          </label>
          <input 
            type="range" min="0" max="50" 
            value={noise} 
            onChange={(e) => setNoise(Number(e.target.value))} 
            className="control-slider" 
          />
        </div>

        {/* Flips */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
          <button 
            className={`btn ${hFlip ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setHFlip(!hFlip)}
            style={{ flex: 1, fontSize: '0.85rem' }}
          >
            Horizontal Flip {hFlip ? 'ON' : 'OFF'}
          </button>
          <button 
            className={`btn ${vFlip ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setVFlip(!vFlip)}
            style={{ flex: 1, fontSize: '0.85rem' }}
          >
            Vertical Flip {vFlip ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Right Column: Visual Comparison */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={20} />
            PyTorch Augmentation Transform Comparison
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Original Input Sample
            </span>
            <div className="preview-box" style={{ height: '200px' }}>
              <canvas ref={canvasRefOrig} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Augmented Training Tensor
            </span>
            <div className="preview-box" style={{ height: '200px', borderColor: 'var(--border-highlight)' }}>
              <canvas ref={canvasRefAug} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '6px' }}>Why Data Augmentation?</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Data Augmentation artificially expands the dataset by creating modified versions of images. This prevents overfitting, enforces translation and scale invariance, and helps deep learning models generalize to unseen real-world photos.
          </p>
        </div>
      </div>
    </div>
  );
}
