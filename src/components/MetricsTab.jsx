import React from 'react';
import { BarChart3, ShieldCheck, Zap, BookOpen } from 'lucide-react';

export default function MetricsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Card: Model Comparison Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={20} />
            CNN Architecture & Transfer Learning Benchmark
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Type</th>
                <th>Parameters</th>
                <th>CIFAR-10 / Custom Acc.</th>
                <th>Train Time / Epoch</th>
                <th>Recommended Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: '#fff' }}>Custom CNN</strong></td>
                <td><span className="badge badge-primary">Scratch (3-Block)</span></td>
                <td>1.2M</td>
                <td>78.4%</td>
                <td>~4s (GPU)</td>
                <td>Small datasets, fast prototyping, educational learning</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#fff' }}>MobileNetV2</strong></td>
                <td><span className="badge badge-success">Transfer Learning</span></td>
                <td>3.5M</td>
                <td>94.6%</td>
                <td>~6s (GPU)</td>
                <td>Edge devices, web apps, mobile inference, leaf/dog classification</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#fff' }}>ResNet18</strong></td>
                <td><span className="badge badge-success">Transfer Learning</span></td>
                <td>11.7M</td>
                <td>96.2%</td>
                <td>~9s (GPU)</td>
                <td>High-accuracy complex vision tasks, residual skip connections</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Row 2: Theoretical & Math Concepts */}
      <div className="grid-2">
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Zap size={20} />
              Convolution & Pooling Mathematics
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>1. 2D Convolution Operation:</strong>
              <br />
              <code style={{ color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                (I * K)[i, j] = ∑ ∑ I[i+m, j+n] • K[m, n]
              </code>
              <br />
              Computes spatial cross-correlation by sliding a learnable kernel filter $K$ across input tensor $I$.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>2. Output Shape Formula:</strong>
              <br />
              <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                W_out = ⌊(W_in - K + 2P) / S⌋ + 1
              </code>
              <br />
              Where $W$ is width, $K$ is kernel size, $P$ is padding, and $S$ is stride.
            </p>
            <p>
              <strong>3. Max Pooling Downsampling:</strong>
              <br />
              Selects the maximum activation value in each $N \times N$ region, reducing spatial dimensions by $75\%$ while retaining scale invariance.
            </p>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={20} />
              Transfer Learning Strategy
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#fff' }}>Phase 1: Feature Extractor Freezing</strong>
              <br />
              We load weights pre-trained on ImageNet ($1.4\text{M}$ images, $1000$ classes). The lower convolutional layers already know low-level vision primitives (edges, textures, shapes). We freeze parameters using:
              <br />
              <code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>param.requires_grad = False</code>
            </p>
            <p>
              <strong style={{ color: '#fff' }}>Phase 2: Fine-Tuning Classifier Head</strong>
              <br />
              We replace the final dense layer (`model.fc` or `classifier[1]`) to match our target classes (e.g. 10 plant leaf disease categories) and train only the new weights using Cosine Annealing learning rate scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
