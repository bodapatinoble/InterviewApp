// screens/AddItemScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const AddItemScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    // Logic to submit the form and add the item
  };

  return (
    <View>
      <TextInput
        placeholder="Enter question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        placeholder="Enter answer 1"
        value={answer1}
        onChangeText={setAnswer1}
      />
      <TextInput
        placeholder="Enter answer 2"
        value={answer2}
        onChangeText={setAnswer2}
      />
      <TextInput
        placeholder="Enter answer 3"
        value={answer3}
        onChangeText={setAnswer3}
      />
      <TextInput
        placeholder="Enter image URL"
        value={image}
        onChangeText={setImage}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default AddItemScreen;
