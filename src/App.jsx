import React, { useState } from 'react';
import { Cpu, Layers, Sliders, BarChart3, Github, Sparkles, ExternalLink } from 'lucide-react';
import ClassifierTab from './components/ClassifierTab';
import CNNVisualizerTab from './components/CNNVisualizerTab';
import AugmentationTab from './components/AugmentationTab';
import MetricsTab from './components/MetricsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('classifier');

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-title">
          <div className="brand-icon">
            <Cpu size={26} />
          </div>
          <div className="brand-text">
            <h1>Neural Vision Studio</h1>
            <p>CNN Architecture, Transfer Learning & Data Augmentation Explorer</p>
          </div>
        </div>

        <div className="header-badges">
          <span className="badge badge-primary">
            <Sparkles size={14} /> PyTorch + ONNX
          </span>
          <span className="badge badge-success">
            Free GitHub Pages Deploy
          </span>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'classifier' ? 'active' : ''}`}
          onClick={() => setActiveTab('classifier')}
        >
          <Cpu size={18} /> Interactive Classifier
        </button>
        <button 
          className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          <Layers size={18} /> CNN Layer Visualizer
        </button>
        <button 
          className={`tab-btn ${activeTab === 'augmentation' ? 'active' : ''}`}
          onClick={() => setActiveTab('augmentation')}
        >
          <Sliders size={18} /> Data Augmentation
        </button>
        <button 
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <BarChart3 size={18} /> Benchmarks & Concepts
        </button>
      </nav>

      {/* Tab Content */}
      <main>
        {activeTab === 'classifier' && <ClassifierTab />}
        {activeTab === 'visualizer' && <CNNVisualizerTab />}
        {activeTab === 'augmentation' && <AugmentationTab />}
        {activeTab === 'metrics' && <MetricsTab />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with <strong>PyTorch</strong>, <strong>React</strong> & <strong>Vite</strong>. Deployed on <strong>GitHub Pages</strong>.
        </p>
      </footer>
    </div>
  );
}
