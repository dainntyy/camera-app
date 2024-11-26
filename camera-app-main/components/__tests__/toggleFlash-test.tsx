import { render, fireEvent } from '@testing-library/react-native';
import CameraScreen from '../CameraScreen';
import { Camera } from 'expo-camera';

jest.mock('expo-camera', () => ({
  Camera: {
    Constants: { FlashMode: { off: 'off', on: 'on', auto: 'auto' } },
  },
}));

describe('toggleFlash', () => {
  it('toggles flash mode between off, on, and auto', () => {
    const mockRoute = { params: { referencePhotoUri: 'mock-uri' } };
    const { getByTestId } = render(<CameraScreen route={mockRoute} />);
    const flashToggleButton = getByTestId('toggle-flash-button'); // Додайте testID до кнопки в компоненті.

    // Початковий стан
    const cameraScreenInstance = getByTestId('camera-instance'); // testID для `Camera`.
    expect(cameraScreenInstance.props.flashMode).toBe('off');

    fireEvent.press(flashToggleButton);
    expect(cameraScreenInstance.props.flashMode).toBe('on');

    fireEvent.press(flashToggleButton);
    expect(cameraScreenInstance.props.flashMode).toBe('auto');

    fireEvent.press(flashToggleButton);
    expect(cameraScreenInstance.props.flashMode).toBe('off');
  });
});
