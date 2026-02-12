export function screenTemplate(name: string) {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ${name} = () => {
  return (
    <View style={styles.container}>
      <Text>${name}</Text>
    </View>
  );
};

export default ${name};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;
}