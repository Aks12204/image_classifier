import torch
import torch.nn as nn
import torchvision.models as models

class CustomCNN(nn.Module):
    """
    Custom Convolutional Neural Network (CNN) built from scratch.
    Demonstrates Convolution, ReLU activation, Max Pooling, Batch Normalization, Dropout, and Fully Connected layers.
    """
    def __init__(self, num_classes=10, in_channels=3):
        super(CustomCNN, self).__init__()
        
        # Block 1: Conv -> BatchNorm -> ReLU -> MaxPool (32x32 -> 16x16)
        self.conv1 = nn.Conv2d(in_channels=in_channels, out_channels=32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Block 2: Conv -> BatchNorm -> ReLU -> MaxPool (16x16 -> 8x8)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Block 3: Conv -> BatchNorm -> ReLU -> MaxPool (8x8 -> 4x4)
        self.conv3 = nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Classification Head
        self.dropout = nn.Dropout(p=0.4)
        self.fc1 = nn.Linear(128 * 4 * 4, 256)
        self.fc_relu = nn.ReLU()
        self.fc2 = nn.Linear(256, num_classes)

    def forward(self, x):
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))
        x = self.pool3(self.relu3(self.bn3(self.conv3(x))))
        
        x = torch.flatten(x, 1) # Flatten spatial dimensions
        x = self.dropout(x)
        x = self.fc_relu(self.fc1(x))
        x = self.fc2(x)
        return x


class TransferLearningModel(nn.Module):
    """
    Transfer Learning Model leveraging pre-trained CNN backbones (ResNet18 or MobileNetV2).
    Freezes early feature extraction layers and updates the classification head for custom classes.
    """
    def __init__(self, backbone='mobilenet_v2', num_classes=10, freeze_backbone=True):
        super(TransferLearningModel, self).__init__()
        self.backbone_name = backbone
        
        if backbone == 'resnet18':
            weights = models.ResNet18_Weights.DEFAULT
            self.model = models.resnet18(weights=weights)
            if freeze_backbone:
                for param in self.model.parameters():
                    param.requires_grad = False
            # Replace final fully connected layer
            in_features = self.model.fc.in_features
            self.model.fc = nn.Linear(in_features, num_classes)
            
        elif backbone == 'mobilenet_v2':
            weights = models.MobileNet_V2_Weights.DEFAULT
            self.model = models.mobilenet_v2(weights=weights)
            if freeze_backbone:
                for param in self.model.parameters():
                    param.requires_grad = False
            # Replace final classifier layer
            in_features = self.model.classifier[1].in_features
            self.model.classifier[1] = nn.Linear(in_features, num_classes)
            
        else:
            raise ValueError(f"Unsupported backbone: {backbone}. Choose 'resnet18' or 'mobilenet_v2'.")

    def forward(self, x):
        return self.model(x)


def get_model(model_name='custom_cnn', num_classes=10, freeze_backbone=True):
    if model_name == 'custom_cnn':
        return CustomCNN(num_classes=num_classes)
    elif model_name in ['resnet18', 'mobilenet_v2']:
        return TransferLearningModel(backbone=model_name, num_classes=num_classes, freeze_backbone=freeze_backbone)
    else:
        raise ValueError(f"Unknown model name: {model_name}")


if __name__ == '__main__':
    # Sanity check forward pass
    dummy_input = torch.randn(4, 3, 32, 32)
    cnn = get_model('custom_cnn', num_classes=10)
    output = cnn(dummy_input)
    print(f"CustomCNN output shape: {output.shape}")

    dummy_resnet_input = torch.randn(4, 3, 224, 224)
    mobilenet = get_model('mobilenet_v2', num_classes=10)
    output_mb = mobilenet(dummy_resnet_input)
    print(f"MobileNetV2 output shape: {output_mb.shape}")
