import csv
import nltk
import re
import random
# import gpt_2_simple as gpt2
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from tensorflow.python.keras.models import load_model
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import Dense


def calculate_flesch_kincaid(text):
    # Count the total number of words
    words = re.findall(r'\w+', text)
    total_words = len(words)

    # Count the total number of sentences
    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)

    # Count the total number of syllables
    total_syllables = 0
    for word in words:
        total_syllables += count_syllables(word)

    # Calculate the average sentence length
    average_sentence_length = total_words / total_sentences

    # Calculate the average syllables per word
    average_syllables_per_word = total_syllables / total_words

    # Calculate the Flesch-Kincaid Grade Level
    flesch_kincaid_grade_level = (
            0.39 * average_sentence_length
            + 11.8 * average_syllables_per_word
            - 15.59
    )

    return flesch_kincaid_grade_level


def count_syllables(word):
    # A simple syllable counting algorithm
    # You can replace this with a more accurate implementation if needed
    count = 0
    vowels = "aeiouy"

    if word[0] in vowels:
        count += 1

    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            count += 1

    if word.endswith("e"):
        count -= 1

    if count == 0:
        count += 1

    return count


def calculate_flesch_reading_ease(text):
    # Count the total number of words
    words = re.findall(r'\w+', text)
    total_words = len(words)

    # Count the total number of sentences
    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)

    # Count the total number of syllables
    total_syllables = 0
    for word in words:
        total_syllables += count_syllables(word)

    # Calculate the average sentence length
    average_sentence_length = total_words / total_sentences

    # Calculate the average syllables per word
    average_syllables_per_word = total_syllables / total_words

    # Calculate the Flesch Reading Ease score
    flesch_reading_ease = (
            206.835
            - 1.015 * average_sentence_length
            - 84.6 * average_syllables_per_word
    )

    return flesch_reading_ease


def count_syllables(word):
    # A simple syllable counting algorithm
    # You can replace this with a more accurate implementation if needed
    count = 0
    vowels = "aeiouy"

    if word[0] in vowels:
        count += 1

    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            count += 1

    if word.endswith("e"):
        count -= 1

    if count == 0:
        count += 1

    return count


def calculate_gunning_fog(text):
    # Count the total number of words
    words = re.findall(r'\w+', text)
    total_words = len(words)

    # Count the total number of sentences
    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)

    # Count the number of complex words
    complex_words = count_complex_words(words)

    # Calculate the Gunning Fog Index
    gunning_fog_index = 0.4 * ((total_words / total_sentences) + 100 * (complex_words / total_words))

    return gunning_fog_index


def count_complex_words(words):
    # Count the number of complex words
    complex_words = 0

    for word in words:
        if count_syllables(word) > 2:  # You can adjust the threshold as per your requirements
            complex_words += 1

    return complex_words


def count_syllables(word):
    # A simple syllable counting algorithm
    # You can replace this with a more accurate implementation if needed
    count = 0
    vowels = "aeiouy"

    if word[0] in vowels:
        count += 1

    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            count += 1

    if word.endswith("e"):
        count -= 1

    if count == 0:
        count += 1

    return count


# sess = gpt2.start_tf_sess()
# gpt2.load_gpt2(sess, model_name='124M')
# text = gpt2.generate(sess, model_name='124M', length=20, prefix="Write a statement about")  # Customize the prefix and length as per your needs
# print(text)


with open('stavki.txt', 'r', encoding='utf-8') as file:
    # Read a line from the file
    statement = file.readline()


# statement = input("Vnesite poved: ")


def generiraj_poved():
    with open('test.csv', 'r', newline='') as csvfile:
        # stavek
        print(statement)

        # word_count
        words = nltk.word_tokenize(statement)
        word_count = len(words) - 1
        print("Word count: ", word_count)

        # lexical_density
        stop_words = set(nltk.corpus.stopwords.words('english'))
        non_stop_words = [word for word in words if word.lower() not in stop_words]
        lexical_density = len(non_stop_words) / len(words) * 100

        print("Lexical Density: {:.2f}%".format(lexical_density))

        # lexical_diversity
        unique_words = len(set(words))
        lexical_diversity = unique_words / word_count * 100
        print("Lexical Diversity: {:.2f}%".format(lexical_diversity))

        # reading_ease
        reading_ease = calculate_flesch_reading_ease(statement)
        print(f"The Flesch Reading Ease score is: {reading_ease}")

        # grade_level
        grade_level = calculate_flesch_kincaid(statement)
        print("Flesch-Kincaid Grade Level:", grade_level)

        # gunning_fog
        gunning_fog = calculate_gunning_fog(statement)
        print(f"The Gunning Fog Index is: {gunning_fog}")

        # neural network

        data = pd.read_csv('output.csv')
        data = data.drop('statement', axis=1)

        X = data.drop('difficulty', axis=1)
        y = data['difficulty']

        label_encoder = LabelEncoder()
        label_encoder.fit(data['difficulty'])
        y = label_encoder.transform(y)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=80)

        model = Sequential()
        model.add(Dense(10, activation='relu', input_shape=(X_train.shape[1],)))
        model.add(Dense(10, activation='relu'))
        model.add(Dense(3, activation='softmax'))

        model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))
        model.save('trained_model.h5')

        model = load_model('trained_model.h5')
        new_data = pd.DataFrame({
            'word_count': [word_count],
            'lexical_density': [lexical_density],
            'lexical_diversity': [lexical_diversity],
            'reading_ease': [reading_ease],
            'grade_level': [grade_level],
            'gunning_fog': [gunning_fog]
        })

        # Perform prediction on the new example
        predicted_labels = model.predict_classes(new_data)
        predicted_labels = label_encoder.inverse_transform(predicted_labels)
        print(predicted_labels)

        if predicted_labels[0] == 'easy':
            return statement
        else:
            return generiraj_poved()


print(generiraj_poved())

# razvrsti

#   difficulty = prompt("Vnesi")

#  data = [
#    [statement, word_count, lexical_density, lexical_diversity, reading_ease, grade_level, gunning_fog, difficulty]]
#  csvwriter.writerows(data)
