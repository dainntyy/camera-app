import React from 'react';
import { render, act } from '@testing-library/react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import CameraScreen from '../CameraScreen';

// Мокаємо залежності
jest.mock('expo-camera', () => ({
  Camera: {
    useCameraPermissions: jest.fn(),
  },
}));

jest.mock('expo-media-library', () => ({
  saveToLibraryAsync: jest.fn(),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
}));

describe('CameraScreen - takePicture', () => {
  let takePictureAsyncMock: jest.Mock;

  beforeEach(() => {
    // Скидання моків перед кожним тестом
    jest.clearAllMocks();

    // Мок для takePictureAsync
    takePictureAsyncMock = jest.fn();
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: { takePictureAsync: takePictureAsyncMock },
    });
  });

  it('saves photo and mirrors it for front camera', async () => {
    // Мок даних для takePictureAsync
    takePictureAsyncMock.mockResolvedValueOnce({ uri: 'mock-photo-uri' });

    // Мок дзеркального відображення
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValueOnce({
      uri: 'mock-flipped-uri',
    });

    // Мок збереження до галереї
    (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValueOnce(true);

    // Рендеримо компонент
    const { getByTestId } = render(<CameraScreen route={{}} />);

    // Знаходимо кнопку для фото
    const captureButton = getByTestId('capture-button');

    // Викликаємо takePicture через натискання кнопки
    await act(async () => {
      captureButton.props.onPress();
    });

    // Перевіряємо виклики
    expect(takePictureAsyncMock).toHaveBeenCalledTimes(1); // Камера зробила фото
    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
      'mock-photo-uri',
      [{ flip: ImageManipulator.FlipType.Horizontal }]
    ); // Дзеркальне відображення
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('mock-flipped-uri'); // Фото збережено
  });

  it('saves photo without flipping for back camera', async () => {
    // Мок даних для takePictureAsync
    takePictureAsyncMock.mockResolvedValueOnce({ uri: 'mock-photo-uri' });

    // Мок збереження до галереї
    (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValueOnce(true);

    // Рендеримо компонент
    const { getByTestId } = render(<CameraScreen route={{}} />);

    // Знаходимо кнопку для фото
    const captureButton = getByTestId('capture-button');

    // Викликаємо takePicture через натискання кнопки
    await act(async () => {
      captureButton.props.onPress();
    });

    // Перевіряємо виклики
    expect(takePictureAsyncMock).toHaveBeenCalledTimes(1); // Камера зробила фото
    expect(ImageManipulator.manipulateAsync).not.toHaveBeenCalled(); // Дзеркальне відображення не викликається
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('mock-photo-uri'); // Фото збережено
  });
});
