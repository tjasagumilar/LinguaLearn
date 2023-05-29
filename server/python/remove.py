import os

import pandas as pd

# urejanje csv za besede

input_file = os.path.join(os.path.dirname(__file__), '..', 'csvBesede.csv')
df = pd.read_csv(input_file)
df['difficulty'] = pd.to_numeric(df['difficulty'], errors='coerce')

df['difficulty'] = df['difficulty'] * 10

df = df.sort_values('difficulty', ascending=True)

df.to_csv(input_file, index=False)


