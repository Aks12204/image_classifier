import os
import time
import json
import torch
import torch.nn as nn
import torch.optim as optim
from dataset import load_dataset
from model import get_model

def train_model(model_name='custom_cnn', dataset_type='synthetic', epochs=5, batch_size=32, lr=0.001, img_size=32):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training using device: {device}")

    # Load dataset
    train_loader, val_loader, classes = load_dataset(
        dataset_type=dataset_type, 
        img_size=img_size, 
        batch_size=batch_size
    )

    # Initialize model
    model = get_model(model_name=model_name, num_classes=len(classes))
    model = model.to(device)

    # Loss function and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    history = {
        'model_name': model_name,
        'dataset_type': dataset_type,
        'classes': classes,
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': []
    }

    print(f"\n--- Starting Training: {model_name} on {dataset_type} ({epochs} Epochs) ---")
    start_time = time.time()

    for epoch in range(epochs):
        # Training Phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        scheduler.step()

        epoch_train_loss = running_loss / total
        epoch_train_acc = (correct / total) * 100.0

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        epoch_val_loss = val_loss / val_total
        epoch_val_acc = (val_correct / val_total) * 100.0

        history['train_loss'].append(round(epoch_train_loss, 4))
        history['train_acc'].append(round(epoch_train_acc, 2))
        history['val_loss'].append(round(epoch_val_loss, 4))
        history['val_acc'].append(round(epoch_val_acc, 2))

        print(f"Epoch [{epoch+1}/{epochs}] | Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.2f}% | Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:.2f}%")

    total_time = time.time() - start_time
    print(f"\nTraining Completed in {total_time:.2f}s!")

    # Save output artifacts
    os.makedirs('./output', exist_ok=True)
    checkpoint_path = f'./output/{model_name}_weights.pth'
    torch.save(model.state_dict(), checkpoint_path)

    metrics_path = f'./output/{model_name}_metrics.json'
    with open(metrics_path, 'w') as f:
        json.dump(history, f, indent=2)

    print(f"Saved weights to: {checkpoint_path}")
    print(f"Saved metrics to: {metrics_path}")
    return model, history

if __name__ == '__main__':
    train_model(model_name='custom_cnn', dataset_type='synthetic', epochs=3, batch_size=16)
