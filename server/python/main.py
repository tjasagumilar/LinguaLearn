import csv
import os
import random
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import CountVectorizer
import nltk
import re
import sys
import json
import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
import joblib


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


def process_all_statements():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'statements.csv')
    output_path = os.path.join(os.path.dirname(__file__), '..', 'output.csv')
    model_path = os.path.join(os.path.dirname(__file__), '..', 'modelX.pkl')

    model = joblib.load(model_path)

    name_to_pronoun = {
        "Ethan": "he",
        "John": "he",
        "Maria": "she",
        "Ava": "she"
    }

    with open(csv_path, 'r') as csvfile, open(output_path, 'w', newline='') as outfile:
        lines = csvfile.readlines()
        writer = csv.writer(outfile)
        writer.writerow(["Statement", "Prediction"])

        for statement in lines:
            original_statement = statement.strip()
            for name, pronoun in name_to_pronoun.items():
                statement = statement.replace(name, pronoun)

            words = nltk.word_tokenize(statement)
            word_count = len(words)

            stop_words = set(nltk.corpus.stopwords.words('english'))
            non_stop_words = [word for word in words if word.lower() not in stop_words]
            lexical_density = len(non_stop_words) / len(words) * 100

            unique_words = len(set(words))
            lexical_diversity = unique_words / word_count * 100

            reading_ease = calculate_flesch_reading_ease(statement)

            grade_level = calculate_flesch_kincaid(statement)

            gunning_fog = calculate_gunning_fog(statement)

            data = [[word_count, lexical_density, lexical_diversity, reading_ease, grade_level, gunning_fog]]
            column_names = ["word_count", "lexical_density", "lexical_diversity", "reading_ease", "grade_level", "gunning_fog"]
            data = pd.DataFrame(data, columns=column_names)

            prediction = model.predict(data).tolist()[0]

            writer.writerow([original_statement, prediction])

if __name__ == "__main__":
    process_all_statements()


def trenirajModel():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv.csv')
    data = pd.read_csv(csv_path)

    data = data.drop('statement', axis=1)

    non_numeric_columns = data.select_dtypes(exclude=['float', 'int']).columns
    data = data.dropna(subset=non_numeric_columns, how='any')

    X = data.drop('difficulty', axis=1)
    y = data['difficulty']

    model = LinearRegression()
    model.fit(X, y)

    model_path = os.path.join(os.path.dirname(csv_path), 'modelX.pkl')
    joblib.dump(model, model_path)

# trenirajModel()

# difficulty = (1 * word_count) + (0.1 * lexical_density) + (0.1 * lexical_diversity) + (
#              0.5 * (100 - reading_ease)) + (2 * grade_level) + (2 * gunning_fog)
