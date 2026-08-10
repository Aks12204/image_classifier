import os
import torch
from model import get_model

def export_to_onnx(model_name='custom_cnn', num_classes=10, img_size=32, output_path=None):
    """
    Exports PyTorch model weights to ONNX format for deployment to edge or web apps.
    """
    if output_path is None:
        os.makedirs('./output', exist_ok=True)
        output_path = f'./output/{model_name}.onnx'

    model = get_model(model_name=model_name, num_classes=num_classes)
    model.eval()

    # Create dummy tensor matching input dimension
    dummy_input = torch.randn(1, 3, img_size, img_size)

    print(f"Exporting {model_name} to ONNX format at {output_path}...")
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input_image'],
        output_names=['output_logits'],
        dynamic_axes={
            'input_image': {0: 'batch_size'},
            'output_logits': {0: 'batch_size'}
        }
    )
    print(f"Successfully exported ONNX model: {output_path}")
    return output_path

if __name__ == '__main__':
    export_to_onnx(model_name='custom_cnn', num_classes=10, img_size=32)
