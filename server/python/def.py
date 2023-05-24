import os
import csv
import pickle
from sklearn.linear_model import LinearRegression


input_file = os.path.join(os.path.dirname(__file__), '..', 'dataset_level.csv')
output_file = os.path.join(os.path.dirname(__file__), '..', 'csvBesede.csv')
model_file = os.path.join(os.path.dirname(__file__), '..', 'regression_model.pkl')


with open(input_file, 'r') as file:
    reader = csv.reader(file)
    data = list(reader)


header = data[0]
data = data[1:]


features = [[int(row[2]), int(row[3]), len(row[4])] for row in data]


target = [float(row[5]) for row in data]


regression_model = LinearRegression()
regression_model.fit(features, target)


with open(model_file, 'wb') as file:
    pickle.dump(regression_model, file)


modified_data = []
for i, row in enumerate(data):
    difficulty = regression_model.predict([features[i]])
    multiplied_difficulty = difficulty[0] * 100
    modified_row = row + [multiplied_difficulty]
    modified_data.append(modified_row)

modified_data.insert(0, header + ['difficulty'])


with open(output_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(modified_data)

print("Data has been successfully written to", output_file)