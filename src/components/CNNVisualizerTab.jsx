import React, { useState, useEffect, useRef } from 'react';
import { Layers, Sliders, Eye, Zap } from 'lucide-react';

const KERNELS = {
  sobelX: { name: 'Sobel Vertical Edges', matrix: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] },
  sobelY: { name: 'Sobel Horizontal Edges', matrix: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]] },
  sharpen: { name: 'Sharpen Kernel', matrix: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
  ridge: { name: 'Ridge Detection', matrix: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]] },
  blur: { name: 'Gaussian Blur', matrix: [[1/16, 2/16, 1/16], [2/16, 4/16, 2/16], [1/16, 2/16, 1/16]] }
};

export default function CNNVisualizerTab() {
  const [selectedKernelKey, setSelectedKernelKey] = useState('sobelX');
  const [reluThreshold, setReluThreshold] = useState(0);
  const [poolSize, setPoolSize] = useState(2);
  const canvasRefInput = useRef(null);
  const canvasRefConv = useRef(null);
  const canvasRefRelu = useRef(null);
  const canvasRefPool = useRef(null);

  useEffect(() => {
    // Generate synthetic test visual pattern
    const width = 120;
    const height = 120;

    const ctxIn = canvasRefInput.current.getContext('2d');
    const ctxConv = canvasRefConv.current.getContext('2d');
    const ctxRelu = canvasRefRelu.current.getContext('2d');
    const ctxPool = canvasRefPool.current.getContext('2d');

    canvasRefInput.current.width = width;
    canvasRefInput.current.height = height;
    canvasRefConv.current.width = width;
    canvasRefConv.current.height = height;
    canvasRefRelu.current.width = width;
    canvasRefRelu.current.height = height;
    canvasRefPool.current.width = width / poolSize;
    canvasRefPool.current.height = height / poolSize;

    // Draw high-contrast shapes (circle, square, diagonal cross) on input canvas
    ctxIn.fillStyle = '#0f172a';
    ctxIn.fillRect(0, 0, width, height);

    // Bright Circle
    ctxIn.fillStyle = '#f43f5e';
    ctxIn.beginPath();
    ctxIn.arc(40, 40, 24, 0, Math.PI * 2);
    ctxIn.fill();

    // Bright Square
    ctxIn.fillStyle = '#38bdf8';
    ctxIn.fillRect(65, 55, 40, 40);

    // Diagonal stripe
    ctxIn.strokeStyle = '#4ade80';
    ctxIn.lineWidth = 6;
    ctxIn.beginPath();
    ctxIn.moveTo(10, 100);
    ctxIn.lineTo(110, 10);
    ctxIn.stroke();

    // Read Input ImageData
    const imgDataIn = ctxIn.getImageData(0, 0, width, height);
    const src = imgDataIn.data;

    // 1. Convolution Pass
    const imgDataConv = ctxConv.createImageData(width, height);
    const dstConv = imgDataConv.data;
    const kernel = KERNELS[selectedKernelKey].matrix;
    const kSize = 3;
    const halfK = 1;

    // Convert to grayscale & Apply Convolution
    const grayBuffer = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let acc = 0;
        for (let ky = -halfK; ky <= halfK; ky++) {
          for (let kx = -halfK; kx <= halfK; kx++) {
            const px = Math.min(Math.max(x + kx, 0), width - 1);
            const py = Math.min(Math.max(y + ky, 0), height - 1);
            const idx = (py * width + px) * 4;
            const gray = (src[idx] + src[idx + 1] + src[idx + 2]) / 3;
            acc += gray * kernel[ky + halfK][kx + halfK];
          }
        }
        const outIdx = y * width + x;
        grayBuffer[outIdx] = acc;
      }
    }

    // Render Conv canvas
    for (let i = 0; i < grayBuffer.length; i++) {
      const val = Math.min(Math.max(grayBuffer[i] + 128, 0), 255);
      const idx = i * 4;
      dstConv[idx] = val;
      dstConv[idx + 1] = val;
      dstConv[idx + 2] = val;
      dstConv[idx + 3] = 255;
    }
    ctxConv.putImageData(imgDataConv, 0, 0);

    // 2. ReLU Activation Pass: max(0, x - threshold)
    const imgDataRelu = ctxRelu.createImageData(width, height);
    const dstRelu = imgDataRelu.data;
    const reluBuffer = new Float32Array(width * height);

    for (let i = 0; i < grayBuffer.length; i++) {
      const activated = Math.max(0, grayBuffer[i] - reluThreshold);
      reluBuffer[i] = activated;
      const val = Math.min(activated * 2, 255);
      const idx = i * 4;
      dstRelu[idx] = val;
      dstRelu[idx + 1] = val;
      dstRelu[idx + 2] = val;
      dstRelu[idx + 3] = 255;
    }
    ctxRelu.putImageData(imgDataRelu, 0, 0);

    // 3. Max Pooling Pass (poolSize x poolSize)
    const pWidth = width / poolSize;
    const pHeight = height / poolSize;
    const imgDataPool = ctxPool.createImageData(pWidth, pHeight);
    const dstPool = imgDataPool.data;

    for (let py = 0; py < pHeight; py++) {
      for (let px = 0; px < pWidth; px++) {
        let maxVal = -Infinity;
        for (let dy = 0; dy < poolSize; dy++) {
          for (let dx = 0; dx < poolSize; dx++) {
            const ix = px * poolSize + dx;
            const iy = py * poolSize + dy;
            const val = reluBuffer[iy * width + ix];
            if (val > maxVal) maxVal = val;
          }
        }
        const pIdx = (py * pWidth + px) * 4;
        const normVal = Math.min(maxVal * 2, 255);
        dstPool[pIdx] = normVal;
        dstPool[pIdx + 1] = normVal;
        dstPool[pIdx + 2] = normVal;
        dstPool[pIdx + 3] = 255;
      }
    }
    ctxPool.putImageData(imgDataPool, 0, 0);

  }, [selectedKernelKey, reluThreshold, poolSize]);

  return (
    <div className="layer-flow">
      {/* Controls Card */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={20} />
            CNN Layer Parameters & Filter Kernels
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="control-group">
            <label className="control-label">Select 3x3 Conv Kernel Filter:</label>
            <select 
              value={selectedKernelKey}
              onChange={(e) => setSelectedKernelKey(e.target.value)}
              className="badge badge-primary"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {Object.keys(KERNELS).map((k) => (
                <option key={k} value={k}>{KERNELS[k].name}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">
              <span>ReLU Threshold Offset:</span>
              <span style={{ color: 'var(--secondary)' }}>{reluThreshold}</span>
            </label>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={reluThreshold}
              onChange={(e) => setReluThreshold(Number(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="control-group">
            <label className="control-label">
              <span>Max Pooling Downsample:</span>
              <span style={{ color: 'var(--accent)' }}>{poolSize}x{poolSize}</span>
            </label>
            <select
              value={poolSize}
              onChange={(e) => setPoolSize(Number(e.target.value))}
              className="badge badge-primary"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value={2}>2x2 Max Pool (Half Size)</option>
              <option value={3}>3x3 Max Pool (1/3 Size)</option>
              <option value={4}>4x4 Max Pool (Quarter Size)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layer Step Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Step 1: Input RGB Image */}
        <div className="layer-card">
          <div className="layer-head">
            <span className="layer-name">1. Input Tensor</span>
            <span className="layer-dims">120x120x3</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <canvas ref={canvasRefInput} className="feature-map-canvas" style={{ width: '140px', height: '140px' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Raw input pixel matrix with Red, Green, and Blue color channels.
          </p>
        </div>

        {/* Step 2: Convolution Filtering */}
        <div className="layer-card">
          <div className="layer-head">
            <span className="layer-name">2. Conv2D Feature Map</span>
            <span className="layer-dims">120x120x1</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <canvas ref={canvasRefConv} className="feature-map-canvas" style={{ width: '140px', height: '140px' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Sliding 3x3 dot product matrix highlighting gradients and edges.
          </p>
        </div>

        {/* Step 3: ReLU Non-linear Activation */}
        <div className="layer-card">
          <div className="layer-head">
            <span className="layer-name">3. ReLU Activation</span>
            <span className="layer-dims">f(x) = max(0, x)</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <canvas ref={canvasRefRelu} className="feature-map-canvas" style={{ width: '140px', height: '140px' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Zeroes out negative weights to introduce non-linearity.
          </p>
        </div>

        {/* Step 4: Max Pooling Layer */}
        <div className="layer-card">
          <div className="layer-head">
            <span className="layer-name">4. Max Pool 2D</span>
            <span className="layer-dims">{120/poolSize}x{120/poolSize}x1</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <canvas ref={canvasRefPool} className="feature-map-canvas" style={{ width: '140px', height: '140px' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Spatial downsampling retaining prominent features while reducing compute.
          </p>
        </div>
      </div>
    </div>
  );
}
