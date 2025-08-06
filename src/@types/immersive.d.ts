declare module 'react-native-immersive' {
  const ImmersiveMode: {
    fullLayout: (enable: boolean) => void;
    setBarMode: (mode: 'Normal' | 'BottomSticky' | 'Sticky' | 'LeanBack') => void;
  };
  export default ImmersiveMode;
}