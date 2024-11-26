import { render, fireEvent } from '@testing-library/react-native';
import CameraScreen from '../CameraScreen';

describe('toggleCameraType', () => {
  it('toggles the camera type between front and back', () => {
    const mockRoute = { params: { referencePhotoUri: 'mock-uri' } };
    const { getByTestId } = render(<CameraScreen route={mockRoute} />);
    const toggleButton = getByTestId('toggle-camera-button'); // Додайте testID до кнопки в компоненті.

    // Очікуємо початковий стан — камера Back
    const cameraScreenInstance = getByTestId('camera-instance'); // testID для `Camera`.
    expect(cameraScreenInstance.props.type).toBe('back');

    fireEvent.press(toggleButton);

    // Після натискання має змінитися на Front
    expect(cameraScreenInstance.props.type).toBe('front');
  });
});
