import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.1.100:8000'; // Use your actual local IP address

const getNoteOpacity = (index: number) => {
  const opacities = [0.85, 0.95, 1.0, 0.9, 0.8];
  return opacities[index % opacities.length];
};

type Note = {
  _id: string;
  title: string;
  content: string;
  labels: string[];
};

const HomeScreen = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [labels, setLabels] = useState(['Work', 'Ideas', 'To Do Lists', 'Groceries']);
  const [selectedLabel, setSelectedLabel] = useState('Work');
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch your notes. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, [fetchNotes]);

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setSelectedLabel(newLabel.trim());
    }
    setNewLabel('');
    setIsAddingLabel(false);
  };

  const renderNote = ({ item, index }: { item: Note; index: number }) => {
    const cardStyle = {
      ...styles.noteCard,
      backgroundColor: `rgba(255, 255, 255, ${getNoteOpacity(index)})`,
      marginTop: index < 2 ? 0 : 15,
    };
    return (
      <View style={cardStyle}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent} numberOfLines={8}>{item.content}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>YOURNOTE</Text>
    </View>
  );

  const renderFeatureCards = () => (
    <View style={styles.featureCardsContainer}>
      <TouchableOpacity style={styles.featureCard}>
        <Text style={styles.featureCardTitle}>Journal Book</Text>
        <Text style={styles.featureCardSubtitle}>your complete unaltered voice.</Text>
        <View style={styles.featureCardIcon}><Icon name="add" color="black" size={20} /></View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.featureCard}>
        <Text style={styles.featureCardTitle}>Password Vault</Text>
        <View style={styles.passwordVaultIcon}><Icon name="lock" color="black" size={40} /></View>
      </TouchableOpacity>
    </View>
  );

  const renderReminders = () => (
    <View style={styles.remindersContainer}>
      <Text style={styles.sectionTitle}>Reminders</Text>
      <View style={styles.reminderItem}><Text style={styles.reminderText}>- Drink 3 glasses of water</Text></View>
      <View style={styles.reminderItem}><Text style={styles.reminderText}>- Go to gym for 2hr</Text></View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {labels.map((label) => (
          <TouchableOpacity
            key={label}
            style={[styles.chip, selectedLabel === label && styles.chipSelected]}
            onPress={() => setSelectedLabel(label)}>
            <Text style={[styles.chipText, selectedLabel === label && styles.chipTextSelected]}>{label}</Text>
          </TouchableOpacity>
        ))}
        {isAddingLabel ? (
          <TextInput
            style={styles.labelInput}
            placeholder="New Label"
            placeholderTextColor="#888"
            value={newLabel}
            onChangeText={setNewLabel}
            onBlur={handleAddLabel}
            autoFocus
          />
        ) : (
          <TouchableOpacity style={styles.addChip} onPress={() => setIsAddingLabel(true)}>
            <Text style={styles.addChipText}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  const filteredNotes = notes.filter(note => note.labels.includes(selectedLabel));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.noteList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<>{renderFeatureCards()}{renderReminders()}<Text style={styles.notesHeaderTitle}>Notes</Text>{renderCategories()}</>}
          ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No notes found for "{selectedLabel}".</Text><Text style={styles.emptySubText}>Try creating one!</Text></View>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        />
        <TouchableOpacity style={styles.addNoteButton}>
          <Text style={styles.addNoteButtonText}>ADD NOTE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, paddingHorizontal: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'Pixel' },
  featureCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  featureCard: { backgroundColor: '#D9D9D9', borderRadius: 20, padding: 20, width: '48%', height: 180, justifyContent: 'space-between' },
  featureCardTitle: { color: '#000', fontSize: 18, fontWeight: 'bold', fontFamily: 'Pixel' },
  featureCardSubtitle: { color: '#333', fontSize: 14, fontFamily },
  featureCardIcon: { backgroundColor: 'white', borderRadius: 25, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' },
  passwordVaultIcon: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  remindersContainer: { backgroundColor: '#333', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily, marginBottom: 10 },
  reminderItem: { paddingVertical: 5 },
  reminderText: { color: '#eee', fontSize: 16, fontFamily },
  notesHeaderTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', fontFamily, marginBottom: 15 },
  categoriesContainer: { marginBottom: 20 },
  chip: { backgroundColor: '#333', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, marginRight: 10 },
  chipSelected: { backgroundColor: '#FEFEFE' },
  chipText: { color: 'white', fontFamily, fontSize: 14 },
  chipTextSelected: { color: 'black' },
  addChip: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#555', justifyContent: 'center', alignItems: 'center' },
  addChipText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  labelInput: { height: 35, backgroundColor: '#333', borderRadius: 20, paddingHorizontal: 15, color: 'white', fontFamily, width: 120 },
  noteList: { justifyContent: 'space-between' },
  noteCard: { width: '48%', borderRadius: 15, padding: 15 },
  noteTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', fontFamily, marginBottom: 8 },
  noteContent: { fontSize: 14, color: '#333', fontFamily, lineHeight: 18 },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16, fontFamily },
  emptySubText: { color: '#777', fontSize: 14, fontFamily, marginTop: 5 },
  addNoteButton: { position: 'absolute', bottom: 20, left: '50%', transform: [{ translateX: -(width * 0.4) }], width: '80%', backgroundColor: '#FEFEFE', borderRadius: 15, paddingVertical: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  addNoteButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', fontFamily },
});

export default HomeScreen;