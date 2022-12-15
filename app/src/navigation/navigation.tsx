import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export const navigate = (name: never, params: never) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const navigateBack = () => {
  console.log(`Pressed!`)
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}