import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from 'react-native';

interface TouchableImageProps {
  onPress: () => void;
  imageSource: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  text?: string;
  textStyle?: object;
}

const TouchableImage: React.FC<TouchableImageProps> = ({
  onPress,
  imageSource,
  containerStyle,
  imageStyle,
  text,
  textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
      <Image source={imageSource} style={[styles.image, imageStyle]} />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 5,
  },
});

export default TouchableImage;
