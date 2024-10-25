+++
date = '2014-01-18T10:15:00+03:00'
title = 'Debugger:A magnificient bastard'
+++

The past couple of days I've been hindered by a nasty albeit ridiculously simple bug.

In a nutshell, I have two static objects I retain in between levels and  before every new level is rendered I free(free as in Manager.Free,in no way is this a Destroy) up all non static(well not exactly but it will suffice for you to undestand). Problem was I initially had only one such object to retain and that was the background so when freeing all inUsePool objects I had a condition that if the count of that pool was 1(the background) then continue on. Now I'm trying to create HUD for the game so I needed to insert another static which is the panel on top for lives,score and the timer. Guess what! I never saw that tiny condition and even worse that tiny condition imposed a freezing on the whole Unity Editor.

It was vexing to fix this. But in my rather short experience with Unity, it freezes only when falling in an infinite loop. This was another such case. That tiny condition was from a while statement. So when I created the panel in code it became automatically an infinite loop. Printing stuff while running was virtually impossible. The Console didn't display printed stuff so no idea could be drawn as to where the game froze.

When things were bleak, there he was, the Debugger, come to the rescue.

Time and time again I have found the debugger to goto guy for difficult situations but it seems I need to make it a regular. Printing stuff on the console is simple and easy to set up so it's usually preferred instead of the debugger. The debugger is a tool that requires the user to be familiar with it's functions in order to be used properly. Also sometimes it's rediculously slow to find an answer since you have to go through many functions and code lines if you haven't set up breakpoints in the right places or don't know how to. But it's time well worth to put in the effort and learn this magnificient bastard.

Experience will help you to know when and how many breakpoints to set up and you most probably will find your answer quicker than a printf/cout/system.out.println(or whatever) network. Not to mention the time you won't lose when you chance upon a nasty bug. I wasted a day going back and forth between prints and debugger(half-assed).

I can safely say.....Lesson learned!From now on debugger will be the main course of action.