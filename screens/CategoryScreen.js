import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useItemContext} from './ItemContext';
import {ref, child, get, set} from 'firebase/database';
import {db} from '../components/config';
// Creating a context to hold the questions a

const CategoryScreen = () => {
  const navigation = useNavigation();
  const {items, addItem} = useItemContext();
  const [categories, setCategories] = useState(['.NET']);
  const [newCategory, setNewCategory] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const categorySet = new Set(); // Using a set to prevent duplicate categories
          Object.values(data).forEach(user => {
            categorySet.add(user.category); // Add each category to the set
          });
          const categoryArray = Array.from(categorySet); // Convert set to array
          setCategories(categoryArray); // Update categories state with the array of categories
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryPress = category => {
    navigation.navigate('ItemListScreen', {category});
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = index => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };

  const handleEditCategory = index => {
    setEditMode(true);
    setEditIndex(index);
    setEditedCategory(categories[index]);
  };

  const handleSaveEdit = () => {
    if (editedCategory.trim() !== '') {
      const updatedCategories = [...categories];
      updatedCategories[editIndex] = editedCategory;
      setCategories(updatedCategories);
      setEditMode(false);
      setEditedCategory('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter new category"
          value={newCategory}
          onChangeText={setNewCategory}
          placeholderTextColor="#000000" // Placeholder text color
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.buttonText}>Add Category</Text>
        </TouchableOpacity>
      </View>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          {editMode && editIndex === index ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.textInput, {flex: 1}]}
                value={editedCategory}
                onChangeText={setEditedCategory}
                placeholderTextColor="#000000" // Placeholder text color
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => handleCategoryPress(category)}>
                <Text style={styles.buttonText}>{category}</Text>
              </TouchableOpacity>
              {/* <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditCategory(index)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCategory(index)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View> */}
            </>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'black',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  // editButtons: {
  //   flexDirection: 'row',
  //   marginLeft: 10,
  // },
  // editButton: {
  //   backgroundColor: '#ffc107',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  // },
  // editButtonText: {
  //   color: '#000',
  //   fontSize: 16,
  // },
  // deleteButton: {
  //   backgroundColor: '#dc3545',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginLeft: 10,
  // },
});

export default CategoryScreen;
