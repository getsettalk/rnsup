export function componentTemplate(name: string) {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {}

const ${name}: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>${name}</Text>
    </View>
  );
};

export default ${name};

const styles = StyleSheet.create({
  container: {},
});
`;
}