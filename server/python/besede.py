import os
import csv


input_file = os.path.join(os.path.dirname(__file__), '..', 'dataset_level.csv')
output_file = os.path.join(os.path.dirname(__file__), '..', 'csvBesede.csv')


with open(input_file, 'r') as file:
    reader = csv.reader(file)
    data = list(reader)


modified_data = [row[1:-1] for row in data]


with open(output_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(modified_data)

print("Data has been successfully written to", output_file)