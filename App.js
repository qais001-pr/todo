/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable func-call-spacing */
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {styles} from './styles/App';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TodoItem from './components/todoItem';
import firestore from '@react-native-firebase/firestore';

export default function App () {
  const [darkMode, setDarkMode] = useState (false);
  const [scaleValue] = useState (new Animated.Value (1));
  const [modalScaleValue] = useState (new Animated.Value (0));
  const [task, setTask] = useState ('');
  const [modalVisible, setModalVisible] = useState (false);
  const [editingTask, setEditingTask] = useState (null);
  const [todoList, setTodoList] = useState ([]);

  useEffect (() => {
    const unsubscribe = firestore ()
      .collection ('todos')
      .orderBy ('createdAt', 'asc')
      .onSnapshot (querySnapshot => {
        const todos = [];
        querySnapshot.forEach (doc => {
          todos.push ({
            id: doc.id,
            ...doc.data (),
          });
        });
        setTodoList (todos);
      });
    return () => unsubscribe ();
  }, []);

  const animateButton = () => {
    Animated.sequence ([
      Animated.timing (scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing (scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start ();
  };

  const openModal = () => {
    setModalVisible (true);
    Animated.timing (modalScaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.out (Easing.back (1.2)),
      useNativeDriver: true,
    }).start ();
  };

  const closeModal = () => {
    Animated.timing (modalScaleValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.in (Easing.ease),
      useNativeDriver: true,
    }).start (() => {
      setModalVisible (false);
      setEditingTask (null);
      setTask ('');
    });
  };

  const toggleDarkMode = () => {
    setDarkMode (!darkMode);
  };

  const handleAddTask = async () => {
    if (!task.trim ()) return;

    try {
      if (editingTask) {
        await firestore ().collection ('todos').doc (editingTask.id).update ({
          text: task,
          updatedAt: firestore.FieldValue.serverTimestamp (),
        });
      } else {
        // Add new task
        await firestore ().collection ('todos').add ({
          text: task,
          completed: false,
          createdAt: firestore.FieldValue.serverTimestamp (),
          updatedAt: firestore.FieldValue.serverTimestamp (),
        });
      }
      closeModal ();
    } catch (error) {}
  };

  const toggleTodoCompletion = async (id, currentStatus) => {
    try {
      await firestore ().collection ('todos').doc (id).update ({
        completed: !currentStatus,
        updatedAt: firestore.FieldValue.serverTimestamp (),
      });
    } catch (error) {}
  };

  const handleEditTask = taskToEdit => {
    setTask (taskToEdit.text);
    setEditingTask (taskToEdit);
    openModal ();
  };

  const handleDeleteTask = async id => {
    try {
      await firestore ().collection ('todos').doc (id).delete ();
    } catch (error) {}
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: darkMode
            ? 'rgba(44, 40, 45, 1)'
            : 'rgba(66, 45, 120, 1)',
        },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          darkMode ? 'rgba(44, 40, 45, 1)' : 'rgba(66, 45, 120, 1)'
        }
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: darkMode
              ? 'rgba(87, 83, 88, 1)'
              : 'rgba(103, 91, 165, 1)',
          },
        ]}
      >
        <Text style={styles.headerText}>TODO</Text>
        <TouchableOpacity
          onPress={toggleDarkMode}
          style={{alignItems: 'center'}}
        >
          <Icon
            name={darkMode ? 'sun' : 'moon'}
            size={20}
            color={darkMode ? 'white' : 'black'}
            style={styles.iconMode}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={todoList}
        keyExtractor={item => item.id.toString ()}
        renderItem={({item}) => (
          <TodoItem
            item={item}
            darkMode={darkMode}
            onToggle={() => toggleTodoCompletion (item.id, item.completed)}
            onEdit={() => handleEditTask (item)}
            onDelete={() => handleDeleteTask (item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Tasks Found</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any tasks yet
            </Text>
          </View>
        }
        contentContainerStyle={{paddingVertical: 8}}
      />

      <Animated.View style={{transform: [{scale: scaleValue}]}}>
        <Pressable
          onPress={openModal}
          style={[
            styles.floatingButton,
            {
              backgroundColor: darkMode
                ? 'rgba(87, 83, 88, 1)'
                : 'rgba(103, 91, 165, 1)',
            },
          ]}
          onPressIn={animateButton}
        >
          <Icon name="plus" size={25} color="white" />
        </Pressable>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
        opacity={0.5}
      >
        <View style={[styles.modalOverlay]}>
          <Animated.View
            style={[
              styles.modalContainer,
              darkMode && styles.darkModalContainer,
              {
                backgroundColor: darkMode
                  ? 'rgba(87, 83, 88, 1)'
                  : 'rgba(103, 91, 165, 1)',
              },
              {
                opacity: modalScaleValue,
                transform: [
                  {
                    scale: modalScaleValue.interpolate ({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Text>

            <TextInput
              style={[styles.input, darkMode && styles.darkInput]}
              placeholder="Enter New Task To Do"
              placeholderTextColor={darkMode ? '#999' : '#888'}
              value={task}
              onChangeText={setTask}
              onSubmitEditing={handleAddTask}
            />

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Animated.View style={{transform: [{scale: scaleValue}]}}>
                <Pressable
                  style={[
                    styles.button,
                    styles.addButton,
                    {
                      backgroundColor: darkMode
                        ? 'rgba(87, 83, 88, 1)'
                        : 'rgba(103, 91, 165, 1)',
                    },
                  ]}
                  onPressIn={animateButton}
                  onPress={handleAddTask}
                >
                  <Text style={styles.buttonText}>
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
