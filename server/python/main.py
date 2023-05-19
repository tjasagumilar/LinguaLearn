import csv
import os
import random
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import CountVectorizer
import nltk
import re
import sys

import numpy as np


# file_path = os.path.join(os.path.dirname(__file__), '..', 'stavki.txt')
# with open(file_path, 'r') as file:
#    content = file.read()

# print(content)

def calculate_flesch_kincaid(text):

    words = re.findall(r'\w+', text)
    total_words = len(words)


    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)

 
    total_syllables = 0
    for word in words:
        total_syllables += count_syllables(word)


    average_sentence_length = total_words / total_sentences

    average_syllables_per_word = total_syllables / total_words

    flesch_kincaid_grade_level = (
            0.39 * average_sentence_length
            + 11.8 * average_syllables_per_word
            - 15.59
    )

    return flesch_kincaid_grade_level


def calculate_flesch_reading_ease(text):

    words = re.findall(r'\w+', text)
    total_words = len(words)


    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)


    total_syllables = 0
    for word in words:
        total_syllables += count_syllables(word)


    average_sentence_length = total_words / total_sentences

    average_syllables_per_word = total_syllables / total_words


    flesch_reading_ease = (
            206.835
            - 1.015 * average_sentence_length
            - 84.6 * average_syllables_per_word
    )

    return flesch_reading_ease


def calculate_gunning_fog(text):

    words = re.findall(r'\w+', text)
    total_words = len(words)

 
    sentences = re.split(r'[.!?]+', text)
    total_sentences = len(sentences)


    complex_words = count_complex_words(words)


    gunning_fog_index = 0.4 * ((total_words / total_sentences) + 100 * (complex_words / total_words))

    return gunning_fog_index


def count_complex_words(words):

    complex_words = 0

    for word in words:
        if count_syllables(word) > 2:
            complex_words += 1

    return complex_words


def count_syllables(word):
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


# statementOriginal = input("x: ")


def klasificiraj_poved():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv.csv')
    with open(csv_path, 'a', newline='') as csvfile:
        # stavek
        #  print(statementOriginal)
        name_to_pronoun = {
            "Ethan": "he",
            "John": "he",
            "Maria": "she",
            "Ava": "she"
        }
        #   statement = statementOriginal

        for name, pronoun in name_to_pronoun.items():
            statement = statement.replace(name, pronoun)

        # word_count
        words = nltk.word_tokenize(statement)
        word_count = len(words)
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
        print(f"The Flesch Reading Ease score is:", reading_ease)

        # grade_level
        grade_level = calculate_flesch_kincaid(statement)
        print("Flesch-Kincaid Grade Level:", grade_level)

        # gunning_fog
        gunning_fog = calculate_gunning_fog(statement)
        print("The Gunning Fog Index is:", gunning_fog)

    # difficulty = (1 * word_count) + (0.1 * lexical_density) + (0.1 * lexical_diversity) + (
    #              0.5 * (100 - reading_ease)) + (2 * grade_level) + (2 * gunning_fog)

    # print(difficulty)

    #  writer = csv.writer(csvfile)
    #   data = [[statement, word_count, lexical_density, lexical_diversity, reading_ease, grade_level, gunning_fog, difficulty]]
    #  writer.writerows(data)


# klasificiraj_poved()


def izberi_poved():
    txt_path = os.path.join(os.path.dirname(__file__), '..', 'stavki.txt')
    with open(txt_path, 'r') as csvfile:
        lines = csvfile.readlines()
        random_line = random.choice(lines)
        return random_line


def razvrsti_poved():
    statement = izberi_poved()

    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv.csv')

    data = []

    with open(csv_path, 'r') as file:
        reader = csv.reader(file)
        next(reader)  
        for row in reader:
            data.append([float(value) for value in row[1:]])  


    X = [row[:-1] for row in data]
    y = [row[-1] for row in data]


    model = LinearRegression()

  
    model.fit(X, y)


    words = nltk.word_tokenize(statement)
    word_count = len(words)
#    print("Word count: ", word_count)

    # lexical_density
    stop_words = set(nltk.corpus.stopwords.words('english'))
    non_stop_words = [word for word in words if word.lower() not in stop_words]
    lexical_density = len(non_stop_words) / len(words) * 100

  #  print("Lexical Density: {:.2f}%".format(lexical_density))

    # lexical_diversity
    unique_words = len(set(words))
    lexical_diversity = unique_words / word_count * 100
  #  print("Lexical Diversity: {:.2f}%".format(lexical_diversity))

    # reading_ease
    reading_ease = calculate_flesch_reading_ease(statement)
   #  print(f"The Flesch Reading Ease score is:", reading_ease)

    # grade_level
    grade_level = calculate_flesch_kincaid(statement)
    #print("Flesch-Kincaid Grade Level:", grade_level)

    # gunning_fog
    gunning_fog = calculate_gunning_fog(statement)
   # print("The Gunning Fog Index is:", gunning_fog)

  #  difficulty = (1 * word_count) + (0.1 * lexical_density) + (0.1 * lexical_diversity) + (
       #     0.5 * (100 - reading_ease)) + (2 * grade_level) + (2 * gunning_fog)

   # print(difficulty)



    new_statement = [word_count, lexical_density, lexical_diversity, reading_ease, grade_level,
                     gunning_fog]  


    predicted_value = model.predict([new_statement])

    print(statement)
    sys.stdout.flush()


razvrsti_poved()