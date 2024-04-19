import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  remove,
  update,
} from 'firebase/database';
import {db} from '../components/config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Swipeable from 'react-native-swipeable';
// import {HandleSaveAnswer1} from '../screens/QuestionDetailScreen';
const QuestionContext = React.createContext();

const ItemListScreen = ({navigation, route}) => {
  const {category} = route.params;
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // console.log(HandleSaveAnswer1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // console.log('Users list:', data); // Log the users list
          // Object.values(data).forEach(user => {
          //   console.log('User ID:', user.id);
          //   console.log('Category:', user.category);
          //   console.log('Question:', user.question);
          //   if (user.answers && user.answers.length > 0) {
          //     // Check if answers are not null or empty
          //     console.log('Answers:');
          //     user.answers.forEach((answer, index) => {
          //       console.log(`Answer ${index + 1}:`, answer);
          //     });
          //   } else {
          //     console.log('No answers provided.');
          //   }
          // });
          const filteredQuestions = Object.values(data).filter(
            item => item.category === category,
          );
          setQuestions(filteredQuestions);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSaveQuestion = newQuestion => {
    setQuestions([...questions, newQuestion]);
    toggleModal();
  };

  // const handleDeleteQuestion = questionToDelete => {
  //   try {
  //     remove(ref(db, 'users/' + questionToDelete));
  //     console.log('id ra babu ', questionToDelete);
  //     setQuestions(prevQuestions =>
  //       prevQuestions.filter(q => q.id !== questionToDelete),
  //     );
  //     Alert.alert('Success', 'Question deleted successfully');
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Error', 'Failed to delete question');
  //   }
  // };
  const handleDeleteQuestion = questionToDelete => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this question?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            try {
              remove(ref(db, 'users/' + questionToDelete));
              setQuestions(prevQuestions =>
                prevQuestions.filter(q => q.id !== questionToDelete)
              );
              Alert.alert('Success', 'Question deleted successfully');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete question');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  const UpdateQuestion = async questionToUpdate => {
    try {
      const questionId = questionToUpdate.id;
      const questionRef = ref(db, 'users/' + questionId);
      await update(questionRef, {
        question: questionToUpdate.question,
        answers: questionToUpdate.answers,
      });
      console.log('Updated question:', questionToUpdate);
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === questionToUpdate.id ? questionToUpdate : q,
        ),
      );
      Alert.alert('Success', 'Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      Alert.alert('Error', 'Failed to update question');
    }
  };

  const filteredQuestions = questions.filter(
    question =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase()),
    // ||
    // question.answers.some(answer =>
    //   answer.toLowerCase().includes(searchQuery.toLowerCase()),
    // ),
  );
  return (
    <QuestionContext.Provider value={{questions, setQuestions}}>
      <View style={styles.container}>
        <Text style={styles.categoryText}>Category: {category}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#000000" // Placeholder text color
        />
        {/* <HandleSaveAnswer1 /> */}
        <ScrollView>
          {filteredQuestions.map(question => (
            <Question
              key={question.id}
              question={question}
              onUpdate={UpdateQuestion}
              onDelete={() => handleDeleteQuestion(question.id)}
              navigation={navigation} // Make sure you are passing the navigation prop here
            />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Question</Text>
        </TouchableOpacity>
        <AddQuestionModal
          visible={isModalVisible}
          onSave={handleSaveQuestion}
          onClose={toggleModal}
          category={category}
        />
      </View>
    </QuestionContext.Provider>
  );
};

const Question = ({question, onUpdate, onDelete, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswers, setEditedAnswers] = useState(question.answers);
  const [isEditMode, setIsEditMode] = useState(false); // Add state for edit mode

  const handleSaveEdit = () => {
    const editedQuestionObj = {
      ...question,
      question: editedQuestion,
      answers: editedAnswers,
    };
    onUpdate(editedQuestionObj);
    setModalVisible(false);
  };
  const navigateToQuestionDetail = () => {
    console.log('fdsfdsf ------------------    ', question);
    navigation.navigate('QuestionDetailScreen', {question});
  };
  const swipeRightButtons = [
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Text>Delete</Text>
    </TouchableOpacity>,
  ];
  return (
    <Swipeable rightButtons={swipeRightButtons}>
      <TouchableOpacity
        onPress={navigateToQuestionDetail}
        style={styles.questionContainer}>
        <Text
          style={[
            styles.questionText,
            {fontWeight: isEditMode ? 'normal' : 'bold'},
          ]}>
          {question.question}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TextInput
              style={styles.questionInput}
              value={editedQuestion}
              onChangeText={setEditedQuestion}
              editable={isEditMode} // Allow editing only in edit mode
              multiline={true} // Enable multiline for the question input
              numberOfLines={4} // Increase the number of lines to display
            />
            <View style={styles.modalButtonsContainer}>
              {isEditMode ? (
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  style={styles.saveBtn}>
                  <Text>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onDelete}
                  style={styles.deleteButton}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Text>Close</Text>
              </TouchableOpacity>
              {!isEditMode && (
                <TouchableOpacity
                  onPress={() => setIsEditMode(true)} // Enter edit mode
                  style={styles.editButton}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Swipeable>
  );
};

const AddQuestionModal = ({visible, onSave, onClose, category}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    {text: '', image: null, codeSnippet: '', example: ''},
  ]);
  const handleAddAnswer = () => {
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {text: '', image: null, codeSnippet: '', example: ''},
    ]);
  };
  const handleAddImage = async index => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.5,
      };

      let result;
      if (index === 'camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (!result.didCancel) {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = {
          ...updatedAnswers[index],
          image: result.assets[0],
        }; // Update answer with image object
        setAnswers(updatedAnswers);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
  const handleSave = () => {
    const newQuestion = {
      id: Math.random(),
      question: question,
      answers: answers,
      category: category,
    };
    onSave(newQuestion);
    const id = Array.from(
      {length: 10},
      () =>
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
          Math.floor(Math.random() * 62)
        ],
    )
      .filter(char => !['.', '#', '$', '[', ']'].includes(char))
      .join('');
    set(ref(db, 'users/' + id), {
      id: id,
      question: question,
      answers: answers,
      category: category,
    })
      .then(() => {
        alert('Data updated ');
      })
      .catch(error => {
        alert(error);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <TextInput
            placeholder="Question"
            value={question}
            onChangeText={setQuestion}
            style={styles.input1}
            multiline={true}
            placeholderTextColor="#000000" // Placeholder text color
          />
          {answers.map((answer, index) => (
            <View key={index}>
              <TextInput
                placeholder={`Answer ${index + 1}`}
                value={answer.text}
                onChangeText={text => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = {
                    text,
                    image: answer.image,
                    codeSnippet: answer.codeSnippet,
                    example: answer.example,
                  };
                  setAnswers(updatedAnswers);
                }}
                style={styles.input}
                multiline={true}
                placeholderTextColor="#000000" // Placeholder text color
              />
              {/* Add code snippet input */}
              <TextInput
                placeholder={`Code Snippet ${index + 1}`}
                value={answer.codeSnippet}
                onChangeText={codeSnippet => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = {
                    ...updatedAnswers[index],
                    codeSnippet: codeSnippet,
                  };
                  setAnswers(updatedAnswers);
                }}
                style={styles.input}
                multiline={true}
                placeholderTextColor="#000000" // Placeholder text color
              />
              {/* Add example input */}
              <TextInput
                placeholder={`Example ${index + 1}`}
                value={answer.example}
                onChangeText={example => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = {
                    ...updatedAnswers[index],
                    example: example,
                  };
                  setAnswers(updatedAnswers);
                }}
                style={styles.input}
                multiline={true}
                placeholderTextColor="#999" // Placeholder text color
              />
              <TouchableOpacity onPress={() => handleAddImage(index)}>
                <Text style={styles.addImageButton}>Add Image</Text>
              </TouchableOpacity>
              {answer.image && (
                <Image
                  source={{uri: answer.image.uri}}
                  style={styles.previewImage}
                />
              )}
            </View>
          ))}
          <TouchableOpacity onPress={handleAddAnswer}>
            <Text style={styles.addAnswerButton}>+</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonsContainer}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={onClose} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#CFF5CA', // Light gray background color
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0080ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  questionContainer: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  answersContainer: {
    marginTop: 10,
  },
  answerContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%', // Full width
    maxWidth: 400, // Max width to keep it centered on larger screens
    alignSelf: 'center',
    marginTop: 50,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    color: 'black',
    height: 100, // Increase the height as needed
    textAlignVertical: 'top', // Align text to the top
  },
  input1: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    color: 'black',
    textAlignVertical: 'top', // Align text to the top
  },
  // Additional styles for code snippet and example inputs
  addImageButton: {
    color: '#007bff', // Dark blue color
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  questionInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  questioninput1: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
  },
  saveButton: {
    marginBottom: 10,
  },
  scrollView: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
  },
  leftSwipeItem: {
    flex: 1,
    backgroundColor: '#b8b8b8',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  rightSwipeItem: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    paddingRight: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  deleteButton: {
    flex: 1, // Occupy full height of the container
    backgroundColor: '#f44336',
    justifyContent: 'center', // Align text vertically in the center
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#607D8B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  answerInput: {
    marginBottom: 5, // Increase spacing after each answer input
    color: 'black',
  },
  searchInput: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ItemListScreen;
