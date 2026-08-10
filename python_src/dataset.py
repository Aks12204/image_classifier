import os
import torch
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
import torchvision.datasets as datasets
from PIL import Image
import numpy as np

def get_data_transforms(img_size=32, is_train=True):
    """
    Constructs PyTorch data augmentation and normalization pipeline.
    
    Data Augmentation Techniques:
    - Random Horizontal Flip: Prevents orientation bias.
    - Random Crop / Resized Crop: Teaches scale invariance.
    - Random Rotation: Robustness against camera angles.
    - Color Jitter: Robustness against lighting variations.
    - Normalization: Scales pixels to zero-mean, unit-variance.
    """
    if is_train:
        return transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.RandomCrop(img_size, padding=4, padding_mode='reflect'),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                 std=[0.229, 0.224, 0.225])
        ])
    else:
        return transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                 std=[0.229, 0.224, 0.225])
        ])


class SyntheticImageDataset(Dataset):
    """
    Generates synthetic image samples for testing model execution without downloading external datasets.
    """
    def __init__(self, num_samples=200, num_classes=10, img_size=32, transform=None):
        self.num_samples = num_samples
        self.num_classes = num_classes
        self.img_size = img_size
        self.transform = transform
        
        # Generate reproducible fake images (noise patterns + synthetic colored shapes)
        np.random.seed(42)
        self.data = []
        self.labels = []
        for i in range(num_samples):
            label = i % num_classes
            # Add class-dependent color bias
            img_arr = np.random.randint(0, 255, (img_size, img_size, 3), dtype=np.uint8)
            img_arr[:, :, label % 3] = (img_arr[:, :, label % 3] + (label + 1) * 20) % 255
            self.data.append(Image.fromarray(img_arr))
            self.labels.append(label)

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        img = self.data[idx]
        label = self.labels[idx]
        if self.transform:
            img = self.transform(img)
        return img, label


def load_dataset(dataset_type='synthetic', data_dir='./data', img_size=32, batch_size=32):
    """
    Helper function to load specified dataset (synthetic, cifar10, or custom directory).
    """
    train_transform = get_data_transforms(img_size=img_size, is_train=True)
    val_transform = get_data_transforms(img_size=img_size, is_train=False)

    if dataset_type == 'synthetic':
        train_ds = SyntheticImageDataset(num_samples=400, num_classes=10, img_size=img_size, transform=train_transform)
        val_ds = SyntheticImageDataset(num_samples=100, num_classes=10, img_size=img_size, transform=val_transform)
        classes = [f"Class_{i}" for i in range(10)]

    elif dataset_type == 'cifar10':
        os.makedirs(data_dir, exist_ok=True)
        train_ds = datasets.CIFAR10(root=data_dir, train=True, download=True, transform=train_transform)
        val_ds = datasets.CIFAR10(root=data_dir, train=False, download=True, transform=val_transform)
        classes = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

    elif dataset_type == 'custom':
        train_dir = os.path.join(data_dir, 'train')
        val_dir = os.path.join(data_dir, 'val')
        if not os.path.exists(train_dir):
            raise FileNotFoundError(f"Custom train dataset directory not found at: {train_dir}")
        train_ds = datasets.ImageFolder(train_dir, transform=train_transform)
        val_ds = datasets.ImageFolder(val_dir, transform=val_transform)
        classes = train_ds.classes

    else:
        raise ValueError(f"Unknown dataset_type: {dataset_type}")

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, classes
