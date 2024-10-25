+++
date = '2015-08-01T16:11:45+03:00'
lastmod = '2015-08-01T16:18:45+03:00'
draft = true
title = 'Unity and Versioning : A successful relationship?'
+++

Till recently I did *NOT* know that one could force Textual format on Unity's serialization of things and avoid battling it out with binary machinations like scenes or prefabs. Probably because a lot of things only just became available to the "free" edition after the release of Unity 5, like navigation stuff or profiler etc etc.

So much time wasted , especially in group projects, when you have to merge things together after individually working on scenes and changing stuff to suit your task's needs.

A little googling on the subject will turn up a lot of problems dating back a few years, but fortunately Unity has come a long way and has even provided us with a couple tools.

First off, you need to set Unity to force text serialization. To do that, go to Editor Settings and set Asset Serialization Mode to Force Text. This might take some time depending on the project.

Unity has support for easy integration with Perforce(which seems to be the weapon of choice for big studios) and Plastic SCM, each with their own guide.

Personally, I use either Github or Tortoise SVN due to circumstances so I needed to follow this [guide](http://docs.unity3d.com/Manual/ExternalVersionControlSystemSupport.html).

A word of advice though for SVN users and more particularly TortoiseSVN, in case you have an ongoing unity project in svn, chances are things like prefabs, animation clips, scene files etc, will have a property called `svn:mime-type` and a value of 'application/octet'. This is bacically a sort of subversion metadata , which are being attributed to the files when being pushed into the repository, telling subversion that this is a binary file. So even if you have forced textual serialization in Unity, you might not be able to open the working copy with tools like TortoiseSVN's Diff. So your next move should be to remove this property from prefabs and scene files at the very least. I will explain why at least those two files in the next paragraph. Let me clarify though, that I have no experience with other SVN clients other than TortoiseSVN so it might differ. But it's logical enough that you might hit the same problem so at least be warned and check it out before going forward.

The reason I said 'at the very least' before is that, just merging text is not enough to merge things correctly. So many things can go wrong that way. Unity provides us with a tool called SmartMerge and in this [guide](http://docs.unity3d.com/Manual/SmartMerge.html) they mention just the scene format and the prefab format as types that SmartMerge supports in terms of merging things the right way. Anything else(like animation clips for example) you can try at your own risk and after you've backed them up.

There are instructions for a variety of third party versioning tools so check it out. TortoiseSVN is the same as TortoiseGit.

One clarification, in most cases you mostly want to add project scoped rules. Basically you want to your source control to use SmartMerge only in this project and only for the types of extensions that the guide gives us. You wouldn't want to mess with other projects unknowingly. Better to do things conservatively and keep your peace of mind.

In my case, I have TortoiseMerge as the global setting and SmartMerge only for .unity and .prefab files. So far it works most of the times. It might miss a couple of things here and there but usually Unity's error/exceptions will easily guide you towards the miss. For example, a prefab might not have been merged right in the sense that you added a script and it's not there after the merge. Considering this usually involved references to this script in other parts of the code you'll probably get some NullReference exception. In the end it rarely happens and it's easy to fix and more importantly, most of the merging works correctly. Sizing up pros and cons it's definitely better than doing everything again manually.

It's always a good idea to back things up before merging but for the most part it works wonders for us.