+++
date = '2013-12-28T11:54:00+03:00'
title = 'Super Bomberman(Both new and old project)'
+++

Work with Orqan Antarika has been paused for a while now. My writing mood has been on a break since and I have thrown myself on learning Unity3D and creating the backbone for Orqan to be implemented on. Realised though early on that I needed some experience in a smaller project so I decided to revisit an old project from my university days.

Super Bomberman. This was a project for a university course on games and smart interfaces which I had made with a fellow student. Back then it was a C++ project based on a given architecture in hopes that we would pick up on standard game architecture components/parts/issues in the process. Many things went wrong since it was our first game project ever. Having to implement all kinds of things with just the theory was difficult enough. In the end and after many setbacks(getting it done in a week instead of three due to personal reasons and some other software mishaps at the end), the game was presented incomplete. Granted, the missing features were such that in just one day's work they would be ready but a deadline is a deadline.

Since then the fact that it was incomplete has been in my mind and now seemed to be a good time to revisit it. It's a perfect chance to experiment with core systems and find a way to produce gameplay and mechanics in an easy way. Not to mention it's a game I have already worked on which means no major design work would be needed and I still have the art and sound resources from back then which is great since I'm no artist.

Right now many of the core systems are ready, getting enhanced as I go. There is a dynamic level generation system(more on this on a later post) already in place which wasn't in the old project. Additionally implemented an object pooling system where "generic" objects are instantiated at the beginning of the game and stay in pools, freePool and inUsePool. Whenever the a newly generated level is to be displayed on screen, a new actor/item has to be spawned etc they first call the pooling management for a reference on a free object and then refit it through the Builder design pattern (ok it might be a cross between Builder and Decorator, more on this on a later post) to take up the behaviour and functionality we want and as suspected get on the inUsePool. When the object is to be deactivated from dying or being destructed by a collision or a timed event or just being used(in the case of a power up), the object again calls on the pooling management to be declared free and get moved to the freePool. This has cut down the loading time from destroying and instantiating objects from prefabs dramatically. This process gets done in the beginning which can be masked by a logo or something and then you can play the game wandering from level to level without even noticing a lag/loading time.

At this point I can generate a level(without enemies and power ups) , spawn the player and move him(following a satisfying move scheme) and detect collisions with walls.

Right now finishing up work on both bombs and fire(spawning, transitioning, extinguishing, collisions etc).

The TODO list consists of:

- Bombs/Fire (currently being worked on)

- Enemies

- Power Ups

- Lives, Score, Timer/Countdown (last and easy)

- Level Editor ( at first it will just give you the ability to create levels with existing art and sound assets and maybe later on functionality for importing custom assets)

- Menu that gives the ability for one to play levels off a specified folder.

- Android port (optional, this is going to be the very last to be tackled and it probably will have a TODO list of its own)

PS:Cleaning up the code and refactoring is also a TODO but I take it for granted as much as anyone will with debugging. Also importing custom assets in the level editor will be considered just as long as there is time and no other priorities. Honestly it's not my goal to provide a game with lots of candy and modability as it is to learn from implementing most of these for later projects.
