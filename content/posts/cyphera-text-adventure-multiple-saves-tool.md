+++
date = '2013-11-23T03:37:00+03:00'
title = 'Cypher: Text Adventure Multiple Saves Tool'
+++

In case you haven't heard of Cypher:A Text Adventure, it is a text adventure game, as the title suggests, developed by the crazy CabreraBrothers from Argentina. This game differs from the rest of text adventures in that it contains graphics and sound content but not enough to call it a graphic adventure. There are graphics elements for the inventory and others that depict Dogeron(the protagonist) or some abstract view of the scene, while gameplay is still text commands you enter and a text description of the scene and events. I know, it's not very easy to explain so you'd rather see for yourself in [Youtube](http://www.youtube.com/watch?v=7MPMnmEnz1g).

One problem in this game is that, since it's developed using Unity3D, it doesn't support multiple save files. It basically stores all variables in all scenes(see [PlayerPrefs](http://docs.unity3d.com/Documentation/ScriptReference/PlayerPrefs.html)) in the registry of the OS you have(Windows Registry or plist files in Mac OS which is a file based registry). Meaning you only get to save into one slot and exploring different choise paths is a no go.

There are ways to implement multiple save slots in Unity3D of course but in those cases that it hasn't been done, there is an alternative!

In both versions you have access in those entries or files containing PlayerPrefs. You can then store them outside the game into either .reg files or .plist files in a place you designate yourself. Yes it's bothersome but it is a way and it also works in parallel with the game running. So I made a tool for Windows x86 in order to do this quickly enough, which can be found here: [CyIE_x86](https://drive.google.com/file/d/0B1GIJ_Q90WIHM2FhMDFqLWh6LVU/view?usp=sharing&resourcekey=0-qVpdPAttG86DnsId9c3Rug). The reason there is no Mac version is ambivalent. First of all plists are files in their own right so if you know where they are stored you can copy them yourself. On the other hand, even if there are novice Mac users I don't have access to a Mac so, unless someone else takes over the Mac version, I cannot put it together.
