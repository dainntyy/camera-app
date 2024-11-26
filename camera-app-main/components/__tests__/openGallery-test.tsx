import { render, fireEvent, act } from '@testing-library/react-native';
import CameraScreen from '../CameraScreen';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

describe('openGallery', () => {
  it('opens the gallery and returns the selected image URI', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      cancelled: false,
      uri: 'selected-image-uri',
    });

    const mockRoute = { params: { referencePhotoUri: 'mock-uri' } };
    const { getByTestId } = render(<CameraScreen route={mockRoute} />);
    const openGalleryButton = getByTestId('open-gallery-button');

    await act(async () => {
      fireEvent.press(openGalleryButton);
    });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });
});
