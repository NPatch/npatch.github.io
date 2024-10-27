+++
date = '2014-03-05T16:28:00+03:00'
title = 'Unity Build Automaton and Super Bomberman updates'
+++

Links have been updated in their respective Project pages.

## Unity Build Automaton

---

Added checkbox for backing up the loaded project prior to any kind of action

Added checkbox for converting whitespace and tab characters in the project's name to underscore (Known issues when running a project where the executable and Data folder contain whitespace/tabs in Linux)

Added tutorial and several notes for running the tool to be available when running it

## Super Bomberman v3

---

Uploaded new version of the game for all previously supported platforms and architectures.

The game is now fully playable. But there's still room for improvement.

Most core systems work very well. Performance has been optimized to run below 15ms. Ideally the game can run ~3.5ms depending on CPU load. The factor that determines the performance is the random number generator algorithm that is used (quite heavily in the dynamic level generation). When the CPU load is acceptable it can run with in 2-3 ms. Dynamic Level Generation is happening in the background as you are playing, but because Unity Coroutines are not true threaded parallelism but pseudo/round robin in nature , the random number algorithm weighs very much in benchmarking. Reason is that the generation algorithm is testing randomly chosen positions in the grid for an object's creation validity. For example, I want to spawn a Hard Wall, I chose a position and test whether a Hard Wall at that position violates any of the level generation rules I've set. If not then I carry on, otherwise I enquire for a new position to the random number generator. Provided that Bomberman has 3 lives to waste and plenty of time to do it , the time needed to generate a new level is a lot less.

I have already tested the game in a couple of Android devices. It plays surprisingly well meaning my work in structure and optimization paid off. The problem that keeps me from releasing it is that I have yet to implement a satisfying solution for controlling the avatar. In particular, the touch controls for Bomberman's movement are not as sharp as I'd like them to be, resulting in delayed turns.

Let's recap on the TODO list:

- Polisihing game details for good playability

- a GUI Help button that shows Controls and Power Up descriptions while the game pauses

- Polishing the codebase

- Controls for the Android version

I've dropped the Level Editor idea for now. It will require quite a lot of work and it's optional as in not really needed. And as interesting as it is ,I fancy completing the Android version much more and finally moving on to something new.
