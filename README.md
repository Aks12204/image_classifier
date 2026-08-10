# 🧠 Neural Vision - CNN & Transfer Learning Image Classifier

An interactive, production-ready Deep Learning codebase and web application exploring **Convolutional Neural Networks (CNNs)**, **Transfer Learning (ResNet18 / MobileNetV2)**, **Data Augmentation**, and **Edge/Web Deployment**.

---

## 🌟 Key Features

- **Custom CNN Architecture from Scratch**: Built with PyTorch (`Conv2D`, `BatchNorm2d`, `ReLU`, `MaxPool2d`, `Dropout`, `Linear`).
- **Transfer Learning Pipeline**: Pre-trained **MobileNetV2** and **ResNet18** backbones fine-tuned for high-accuracy plant leaf disease and custom object recognition.
- **Data Augmentation Sandbox**: Real-time visualization of image transformations (`RandomRotation`, `RandomCrop`, `ColorJitter`, `HorizontalFlip`, `GaussianNoise`).
- **Visual Layer Explorer**: Interactive feature map rendering showing how sliding $3 \times 3$ kernel filters, non-linear activation functions, and spatial pooling downsampling transform image matrices.
- **100% Free Hosting & Deployment**: Client-side ONNX Runtime web app ready to deploy automatically on **GitHub Pages**.

---

## 📐 Deep Learning Foundations

### 1. Convolution Operation
The 2D Convolution operation slides a matrix of learnable weights (kernel filter $K$) over input image $I$:

$$(I * K)[i, j] = \sum_{m} \sum_{n} I[i+m, j+n] \cdot K[m, n]$$

Output spatial dimensions after convolution:

$$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - K + 2P}{S} \right\rfloor + 1$$

*where $W$ is width, $K$ is kernel dimension, $P$ is padding, and $S$ is stride.*

### 2. Transfer Learning Strategy
Instead of training millions of parameters from scratch, we leverage pre-trained representations learned on ImageNet ($1.4\text{M}$ images across $1000$ categories):

1. **Feature Extraction**: Freeze early convolutional layers (`param.requires_grad = False`).
2. **Classifier Head Adaptation**: Replace the final dense linear layer to match target custom classes (e.g. Plant Leaf Diseases or CIFAR-10).
3. **Fine-Tuning**: Train with Cosine Annealing learning rate schedules and AdamW optimizer.

---

## 🚀 Quick Start Guide

### 1. Python Deep Learning Pipeline (PyTorch)

```bash
# Install Python requirements
pip install -r requirements.txt

# Run synthetic training demo out-of-the-box
python python_src/train.py

# Export trained PyTorch model to ONNX format
python python_src/export_onnx.py
```

### 2. Interactive Web Application (Vite + React)

```bash
# Install Node dependencies
npm install

# Launch local development server
npm run dev

# Build production distribution bundle
npm run build
```

---

## 🌐 Free Deployment to GitHub Pages

This project includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Steps to Enable Free GitHub Pages Deployment:
1. Initialize Git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Image Classifier Studio"
   ```
2. Create a new repository on GitHub and link your local project:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub Repository, navigate to **Settings** -> **Pages**.
4. Set **Source** to **GitHub Actions**.
5. Your live app will automatically build and deploy at `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`!

---

## 🛠 Project Structure

```
.
├── python_src/
│   ├── model.py           # PyTorch CustomCNN & TransferLearning (ResNet18, MobileNetV2)
│   ├── dataset.py         # PyTorch Data Augmentation & DataLoader pipelines
│   ├── train.py           # Training loop, validation metrics, checkpointing
│   └── export_onnx.py     # ONNX model exporter
├── src/
│   ├── components/        # Interactive Classifier, Layer Visualizer, Augmentation Sandbox
│   ├── styles/            # Sleek dark-mode design system
│   ├── App.jsx            # Main App layout & tab routing
│   └── main.jsx           # React DOM root entry point
├── .github/
│   └── workflows/
│       └── deploy.yml     # Automated GitHub Pages CI/CD workflow
├── package.json           # Node configuration & dependencies
├── vite.config.js         # Vite bundler configuration (relative path assets)
└── README.md              # Documentation
```
