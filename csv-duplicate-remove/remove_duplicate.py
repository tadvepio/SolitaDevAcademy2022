# A simple python script to remove duplicates from
# a csv file. It reads from the original file and writes down
# the filtered lines to a new file.

from more_itertools import unique_everseen
with open('your_input_file.csv', 'r') as f, open('new_filtered_csv_file.csv', 'w') as out_file:
    out_file.writelines(unique_everseen(f))
