import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DashboardNavbar({ onToggleMenu }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Dashboard</Text>
      <Pressable style={styles.burgerButton} onPress={onToggleMenu}>
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  burgerButton: {
    width: 38,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3458b8',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  burgerLine: {
    width: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
