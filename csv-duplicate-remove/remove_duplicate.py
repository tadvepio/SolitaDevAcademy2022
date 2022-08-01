from more_itertools import unique_everseen
with open('your_input_file.csv', 'r') as f, open('new_filtered_csv_file.csv', 'w') as out_file:
    out_file.writelines(unique_everseen(f))
