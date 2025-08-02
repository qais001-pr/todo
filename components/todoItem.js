/* eslint-disable func-call-spacing */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TodoItem = ({item, darkMode, onToggle, onEdit, onDelete}) => {
  const fadeAnim = React.useRef (new Animated.Value (1)).current;

  const handleDelete = () => {
    onDelete (item.id);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
        item.completed &&
          (darkMode ? styles.completedDark : styles.completedLight),
        {opacity: fadeAnim},
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggle (item.id)}
        style={styles.touchable}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.checkboxContainer}>
            <Icon
              name={item.completed ? 'check-circle' : 'circle'}
              size={24}
              color={
                item.completed
                  ? darkMode ? '#9F7AEA' : '#7C4DFF'
                  : darkMode ? '#718096' : '#CBD5E0'
              }
              style={styles.checkbox}
            />
          </View>
          <Text
            style={[
              styles.text,
              darkMode && styles.darkText,
              item.completed && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          disabled={item.completed}
          onPress={() => {
            onEdit (item);
          }}
          style={styles.actionButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Icon name="pen" size={16} color={darkMode ? '#9F7AEA' : '#7C4DFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.actionButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Icon
            name="trash-alt"
            size={16}
            color={darkMode ? '#FC8181' : '#F56565'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create ({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#7C4DFF',
  },
  darkContainer: {
    backgroundColor: '#2D3748',
    borderLeftWidth: 4,
    borderLeftColor: '#9F7AEA',
  },
  completedLight: {
    backgroundColor: '#FAF5FF',
    borderLeftColor: '#B794F4',
  },
  completedDark: {
    backgroundColor: '#4A5568',
    borderLeftColor: '#6B46C1',
  },
  touchable: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#2D3748',
    paddingRight: 8,
  },
  darkText: {
    color: '#EDF2F7',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#718096',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});

export default TodoItem;
