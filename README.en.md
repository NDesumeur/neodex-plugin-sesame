# Open Sesame

A pixel art logic game: make up a password that follows more and more twisted rules.

*Version française : [README.md](README.md)*

**Words are checked in French**: the day of the week, the cheese, the capital city and the riddle answer must be French words (the interface is translated).

## Controls

- **Type** your password in the box above the rules.
- **Enter**: submit when every rule is green, then play again.
- For the animal emoji: **Windows + period** opens the emoji picker.

## How it works

- At first, only one rule. As soon as every rule shown is met, a new one appears. There are **sixteen**.
- The old rules must **stay true**, and they step on each other: the digits must add up to **20**, but you also need the result of a sum and **the current hour**; a French cheese, but **no more than three E's**…
- Each game picks a random **capital city** and **riddle**.
- In **red** at the top, what's wrong; in **green**, what's right. The counters (digit sum, length, number of E's) update as you type.
- The timer starts at the first letter and stops when the password is accepted.

## Stats

The Bests panel keeps your **best time**, the **furthest rule** reached and the number of **passwords accepted**.

## Data and sync

Your bests are saved by NeoDex, backed up and synced between your PCs if sync is on. The password you type is never saved.

## Install

In NeoDex: **NeoStore → Discover → Open Sesame → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## Full screen

The “FULL SCREEN” button puts the game in full screen: the box you type in stays at the top and the rules fill the rest of the screen. The rules also grow with the window.
