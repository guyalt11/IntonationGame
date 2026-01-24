import random
import math

# Parameters
level = 1
lives = 3
min_freq = 130.81  # C3
max_freq = 1046.50 # C6
delta_f_start = 50  # starting difference in Hz
delta_f_min = 2     # minimum difference in Hz
k = 0.2             # difficulty scaling factor

# First note
first = random.uniform(min_freq, max_freq)

while lives > 0:
    print(f"level: {level}, lives: {lives}")

    # Calculate difference for this level (exponential decay)
    difference = delta_f_start * math.exp(-k * level) + delta_f_min

    # Determine direction without exceeding bounds
    if first + difference > max_freq:
        direction = "d"
    elif first - difference < min_freq:
        direction = "u"
    else:
        direction = random.choice(["u", "d"])

    second = first + difference if direction == "u" else first - difference
    print(f"first: {first:.2f} Hz, second: {second:.2f} Hz")

    answer = input("u/d? ").strip().lower()
    while answer not in ["u", "d"]:
        answer = input("Invalid input. Up or d? ").strip().lower()

    level += 1
    first = second

    if direction != answer:
        lives -= 1

print("Game over")

