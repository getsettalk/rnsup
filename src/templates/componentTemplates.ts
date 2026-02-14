export type ComponentType = 'presentational' | 'container';

export function getComponentTemplate(name: string, type: ComponentType): string {
  switch (type) {
    case 'container':
      return containerComponentTemplate(name);
    default:
      return presentationalComponentTemplate(name);
  }
}

function presentationalComponentTemplate(name: string) {
  return `import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Props {
  title?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ${name}: React.FC<Props> = ({ title, children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

export default ${name};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});
`;
}

function containerComponentTemplate(name: string) {
  return `import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface State {
  loading: boolean;
  error: string | null;
}

const ${name}: React.FC<Props> = ({ style, children }) => {
  const navigation = useNavigation();
  const [state, setState] = useState<State>({ loading: false, error: null });

  React.useEffect(() => {
    // TODO: Initialize component data
  }, []);

  return (
    <View style={[styles.container, style]}>
      {state.loading ? (
        <View style={styles.centerContent}>
          {/* Loading indicator */}
        </View>
      ) : state.error ? (
        <View style={styles.centerContent}>
          {/* Error display */}
        </View>
      ) : (
        children
      )}
    </View>
  );
};

export default ${name};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;
}
