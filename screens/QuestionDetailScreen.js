import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {ref, update} from 'firebase/database'; // Import the necessary Firebase modules
import {db} from '../components/config';

const QuestionDetailScreen = ({route, navigation}) => {
  const {question} = route.params;
  const [editMode, setEditMode] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswers, setEditedAnswers] = useState(
    question.answers.map(answer => ({...answer})),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [newAnswer, setNewAnswer] = useState({
    text: '',
    codeSnippet: '',
    example: '',
    image: null,
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  console.log('Route params:--- ', route.params.question);

  const handleSave = async () => {
    // Check if question.id is valid
    if (!question.id || typeof question.id !== 'string') {
      console.error('Invalid question ID:', question.id);
      Alert.alert('Error', 'Invalid question ID');
      return;
    }
    // Update the question details to the server
    try {
      const questionId = question.id;
      const questionRef = ref(db, `users/${questionId}`);
      await update(questionRef, {
        question: editedQuestion,
        answers: editedAnswers,
      });
      // Update the question details locally
      const updatedQuestion = {
        ...question,
        question: editedQuestion,
        answers: editedAnswers,
      };
      navigation.setParams({question: updatedQuestion}); // Update the question in navigation params
      setEditMode(false); // Exit edit mode
      Alert.alert('Success', 'Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      Alert.alert('Error', 'Failed to update question');
    }
  };
  navigation.setOptions({
    headerRight: () => (
      <View style={{flexDirection: 'row', marginRight: 2}}>
        {/* <TouchableOpacity onPress={handleAddAnswer} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity> */}
        {editMode ? (
          <TouchableOpacity onPress={handleSave} style={styles.addButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleAddAnswer} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
          <Text style={styles.editButtonText}>
            {editMode ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#fff', // White background color
      elevation: 5, // Add elevation for shadow on Android
      shadowColor: '#F66E0A', // Shadow color
      shadowOffset: {width: 0, height: 3}, // Shadow offset
      shadowOpacity: 3.25, // Shadow opacity
      shadowRadius: 3.84, // Shadow radius
    },
  });
  const handleAddAnswer = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Reset new answer state
    setNewAnswer({text: '', codeSnippet: '', example: '', image: null});
  };

  const handleSaveAnswer = async () => {
    try {
      // Update editedAnswers with the new answer
      const updatedAnswers = [...editedAnswers, newAnswer];

      // Create a reference to the question node in the database
      const questionRef = ref(db, `users/${question.id}`);

      // Update the answers array in the database
      await update(questionRef, {answers: updatedAnswers});

      // Log the question and updated answers
      console.log('Question:', editedQuestion);
      console.log('Updated Answers:', updatedAnswers);

      // Close modal
      handleCloseModal();
    } catch (error) {
      console.error('Error saving answer:', error);
      Alert.alert(
        'Error May Be Server BUSY',
        'Failed to save answer, PLEASE NAVIGATE BACK and TRY AGAIN',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {editMode ? (
          <>
            <Text style={styles.questionTitle}>Question</Text>
            <TextInput
              style={styles.editquestionText}
              value={editedQuestion}
              onChangeText={setEditedQuestion}
              multiline={true}
            />
          </>
        ) : (
          <Text style={styles.questionText}>{question.question}</Text>
        )}
        {/* <Text style={styles.categoryText}>Category: {question.category}</Text> */}
        {editedAnswers.map((answer, index) => (
          <View key={index} style={styles.answerContainer}>
            {editMode ? (
              <>
                <Text style={styles.answerTitle}>{`Answer ${index + 1}:`}</Text>
                <TextInput
                  placeholder={`Answer ${index + 1}`}
                  value={answer.text}
                  onChangeText={text => {
                    const updatedAnswers = [...editedAnswers];
                    updatedAnswers[index] = {...answer, text};
                    setEditedAnswers(updatedAnswers);
                  }}
                  style={styles.answerInput}
                  multiline={true}
                />
                <Text style={styles.answerTitle}>{`Code Snippet ${
                  index + 1
                }:`}</Text>
                <TextInput
                  placeholder={`Code Snippet ${index + 1}`}
                  value={answer.codeSnippet}
                  onChangeText={codeSnippet => {
                    const updatedAnswers = [...editedAnswers];
                    updatedAnswers[index] = {...answer, codeSnippet};
                    setEditedAnswers(updatedAnswers);
                  }}
                  style={styles.answerInput}
                  multiline={true}
                />
                <Text style={styles.answerTitle}>{`Example ${
                  index + 1
                }:`}</Text>

                <TextInput
                  placeholder={`Example ${index + 1}`}
                  value={answer.example}
                  onChangeText={example => {
                    const updatedAnswers = [...editedAnswers];
                    updatedAnswers[index] = {...answer, example};
                    setEditedAnswers(updatedAnswers);
                  }}
                  style={styles.answerInput}
                  multiline={true}
                />
                {/* <TouchableOpacity>
                  <Text style={styles.addImageButton}>Add Image</Text>
                </TouchableOpacity> */}
              </>
            ) : (
              <>
                <Text style={styles.answerTitle}>{`Answer ${index + 1}:`}</Text>
                <Text style={styles.answerText}>{answer.text}</Text>
                {answer.codeSnippet && (
                  <>
                    <Text style={styles.answerTitle}>{`Code Snippet ${
                      index + 1
                    }:`}</Text>
                    <Text
                      style={
                        styles.answerText
                      }>{` ${answer.codeSnippet}`}</Text>
                  </>
                )}
                {answer.example && (
                  <>
                    <Text style={styles.answerTitle}>{`Example ${index + 1}:
                  `}</Text>
                    <Text
                      style={styles.answerText}>{` ${answer.example}`}</Text>
                  </>
                )}
              </>
            )}
            {answer.image && typeof answer.image === 'object' ? (
              <Image
                source={{uri: answer.image.uri}}
                style={styles.answerImage}
              />
            ) : answer.image && typeof answer.image === 'string' ? (
              <Image source={{uri: answer.image}} style={styles.answerImage} />
            ) : null}
          </View>
        ))}
        {editMode && (
          // <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          //   <Text style={styles.saveButtonText}>Save</Text>
          // </TouchableOpacity>
          <TouchableOpacity onPress={handleAddAnswer} style={styles.saveButton}>
            <Text style={styles.addButtonText}>Add Answer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {/* {editMode && (
        <TouchableOpacity onPress={handleAddAnswer} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.modalContainer}>
            <Text style={styles.answerTitle}>Add Answer </Text>
            <TextInput
              placeholder="Answer"
              value={newAnswer.text}
              onChangeText={text => setNewAnswer({...newAnswer, text})}
              style={styles.modalInput}
              multiline={true}
              placeholderTextColor="#000000" // Placeholder text color
            />
            <TextInput
              placeholder="Code Snippet"
              value={newAnswer.codeSnippet}
              onChangeText={codeSnippet =>
                setNewAnswer({...newAnswer, codeSnippet})
              }
              style={styles.modalInput}
              multiline={true}
              placeholderTextColor="#000000" // Placeholder text color
            />
            <TextInput
              placeholder="Example"
              value={newAnswer.example}
              onChangeText={example => setNewAnswer({...newAnswer, example})}
              style={styles.modalInput}
              multiline={true}
              placeholderTextColor="#000000" // Placeholder text color
            />
            {/* Add input field for image */}
            <TouchableOpacity
              onPress={handleSaveAnswer}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.modalButton1}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default QuestionDetailScreen;
// export function HandleSaveAnswer1() {
//   return <Text>HI</Text>;
// }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#CFF5CA', // Light gray background color
    shadowColor: '#F89A56', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5, // Add elevation for shadow on Android
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 8,
    color: 'black',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editquestionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    backgroundColor: '#fff',
    shadowColor: '#000', // Shadow color
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  answerContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 5,
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  questionTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  answerInput: {
    fontSize: 18,
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    textAlignVertical: 'top',
  },
  answerImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  saveButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
    backgroundColor: '#0070ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#ff6f00', // Orange background
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
    borderRadius: 5, // Reduced border radius
    marginRight: 3,
  },
  editButtonText: {
    color: '#fff', // White text color
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4caf50', // Green background
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
    borderRadius: 5, // Reduced border radius
    marginRight: 3,
  },
  addButtonText: {
    color: '#fff', // White text color
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 50, // Adjust padding as needed
    borderRadius: 10,
    marginTop: 50,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 300,
    width: '100%', // Full width
    maxWidth: 400, // Max width to keep it centered on larger screens
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInput: {
    width: '90%',
    marginBottom: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 20,
    backgroundColor: '#fff', // Yellow background
    color: 'black',
  },
  modalButton: {
    backgroundColor: '#22A3ED', // Purple background
    paddingVertical: 15, // Increased padding vertical
    paddingHorizontal: 30, // Increased padding horizontal
    borderRadius: 10, // Larger border radius
    marginBottom: 20, // Increased margin bottom
  },
  modalButton1: {
    backgroundColor: '#EE1F64', // Purple background
    paddingVertical: 15, // Increased padding vertical
    paddingHorizontal: 30, // Increased padding horizontal
    borderRadius: 10, // Larger border radius
    marginBottom: 20, // Increased margin bottom
  },
  modalButtonText: {
    color: '#fff', // Blue text color
    fontSize: 18, // Smaller font size
    fontWeight: 'bold', // Bold text
  },
});
