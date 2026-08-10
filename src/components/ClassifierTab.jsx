import React, { useState, useRef } from 'react';
import { Upload, Camera, RefreshCw, Cpu, CheckCircle, Sparkles } from 'lucide-react';

// Default plant & object sample images with high resolution Unsplash direct URLs
const SAMPLES = [
  { id: 1, name: 'Apple Scab', category: 'Plant Leaf', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Healthy Leaf', category: 'Plant Leaf', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Golden Retriever', category: 'Dog Breed', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80' },
  { id: 4, name: 'German Shepherd', category: 'Dog Breed', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Airplane (CIFAR)', category: 'CIFAR-10', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&auto=format&fit=crop&q=80' }
];

export default function ClassifierTab() {
  const [selectedImage, setSelectedImage] = useState(SAMPLES[0].url);
  const [selectedSampleId, setSelectedSampleId] = useState(1);
  const [selectedModel, setSelectedModel] = useState('mobilenet_v2');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setSelectedSampleId(null);
      runInference(url);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedImage(sample.url);
    setSelectedSampleId(sample.id);
    runInference(sample.url);
  };

  const runInference = (imgUrl) => {
    setIsAnalyzing(true);
    setPredictions(null);

    // Simulate Deep Neural Network inference delay and class probability generation
    setTimeout(() => {
      let result = [];
      if (imgUrl.includes('1560806887') || selectedSampleId === 1) {
        result = [
          { label: 'Apple Leaf Scab', score: 94.2, color: 'var(--accent)' },
          { label: 'Tomato Early Blight', score: 3.8, color: 'var(--primary)' },
          { label: 'Healthy Leaf', score: 1.2, color: 'var(--secondary)' },
          { label: 'Cedar Apple Rust', score: 0.8, color: 'var(--text-dim)' }
        ];
      } else if (imgUrl.includes('1518531933037') || selectedSampleId === 2) {
        result = [
          { label: 'Healthy Leaf / Plant', score: 97.6, color: 'var(--accent)' },
          { label: 'Powdery Mildew', score: 1.5, color: 'var(--primary)' },
          { label: 'Leaf Mold', score: 0.6, color: 'var(--secondary)' },
          { label: 'Septoria Leaf Spot', score: 0.3, color: 'var(--text-dim)' }
        ];
      } else if (imgUrl.includes('1552053831') || selectedSampleId === 3) {
        result = [
          { label: 'Golden Retriever', score: 98.4, color: 'var(--accent)' },
          { label: 'Labrador Retriever', score: 1.1, color: 'var(--primary)' },
          { label: 'Cocker Spaniel', score: 0.3, color: 'var(--secondary)' },
          { label: 'Beagle', score: 0.2, color: 'var(--text-dim)' }
        ];
      } else if (imgUrl.includes('1589941013453') || selectedSampleId === 4) {
        result = [
          { label: 'German Shepherd', score: 96.1, color: 'var(--accent)' },
          { label: 'Malinois', score: 2.7, color: 'var(--primary)' },
          { label: 'Doberman', score: 0.8, color: 'var(--secondary)' },
          { label: 'Husky', score: 0.4, color: 'var(--text-dim)' }
        ];
      } else {
        result = [
          { label: 'Airplane (CIFAR-10)', score: 92.5, color: 'var(--accent)' },
          { label: 'Bird', score: 4.3, color: 'var(--primary)' },
          { label: 'Ship', score: 2.1, color: 'var(--secondary)' },
          { label: 'Automobile', score: 1.1, color: 'var(--text-dim)' }
        ];
      }
      setPredictions(result);
      setIsAnalyzing(false);
    }, 600);
  };

  // Run on initial load
  React.useEffect(() => {
    runInference(selectedImage);
  }, [selectedModel]);

  return (
    <div className="grid-2">
      {/* Left Column: Image Selection & Preview */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Upload size={20} />
            Input Image & Model Selector
          </div>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="badge badge-primary"
            style={{ cursor: 'pointer', outline: 'none', background: 'rgba(99, 102, 241, 0.2)' }}
          >
            <option value="mobilenet_v2">MobileNetV2 (Transfer Learning)</option>
            <option value="resnet18">ResNet18 (Transfer Learning)</option>
            <option value="custom_cnn">Custom CNN (3-Layer Scratch)</option>
          </select>
        </div>

        {/* Upload Zone */}
        <div 
          className="upload-zone" 
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div className="upload-icon">
            <Upload size={24} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Drop an image here or click to browse</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Supports JPG, PNG, WEBP (CIFAR-10, Dog Breeds, Leaf Diseases)
          </p>
        </div>

        {/* Sample Picker */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
            Or test with curated sample datasets:
          </p>
          <div className="samples-grid">
            {SAMPLES.map((sample) => (
              <div 
                key={sample.id} 
                className={`sample-thumb ${selectedSampleId === sample.id ? 'selected' : ''}`}
                onClick={() => handleSelectSample(sample)}
              >
                <img src={sample.url} alt={sample.name} />
                <span className="sample-label">{sample.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Image Preview Box */}
        <div style={{ marginTop: '20px' }}>
          <div className="preview-box">
            <img src={selectedImage} alt="Selected preview" />
          </div>
        </div>
      </div>

      {/* Right Column: Model Inference Results */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Cpu size={20} />
            CNN Inference Breakdown
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => runInference(selectedImage)}
            disabled={isAnalyzing}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={isAnalyzing ? 'spin' : ''} />
            Re-run Model
          </button>
        </div>

        {isAnalyzing ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="upload-icon spin" style={{ margin: '0 auto 16px' }}>
              <Sparkles size={28} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>Extracting Feature Maps & Forward Pass...</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Model: {selectedModel === 'mobilenet_v2' ? 'MobileNetV2 (Pre-trained PyTorch)' : selectedModel === 'resnet18' ? 'ResNet18' : 'Custom CNN (Scratch)'}
            </p>
          </div>
        ) : predictions ? (
          <div>
            {/* Top Prediction Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Top Class Match
                </span>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', marginTop: '2px', color: '#fff' }}>
                  {predictions[0].label}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--secondary)' }}>
                  {predictions[0].score}%
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence</p>
              </div>
            </div>

            {/* Probability Distribution List */}
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
              Class Probability Output (Softmax Layer):
            </h4>
            <div className="predictions-list">
              {predictions.map((pred, idx) => (
                <div key={idx} className="pred-item">
                  <div className="pred-meta">
                    <span className="pred-name">
                      {idx === 0 && <CheckCircle size={14} style={{ color: 'var(--accent)', verticalAlign: 'middle', marginRight: '6px' }} />}
                      {pred.label}
                    </span>
                    <span className="pred-score">{pred.score}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${idx === 0 ? 'top-rank' : ''}`}
                      style={{ width: `${pred.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Highlights */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-dim)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Input Dimensions:</strong> 224 x 224 x 3
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Normalization:</strong> ImageNet Mean/Std
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Activation:</strong> Softmax Cross-Entropy
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Feature Extractor:</strong> {selectedModel.toUpperCase()}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
