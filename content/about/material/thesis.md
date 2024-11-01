+++
date = '2014-01-14T14:38:59+02:00'
title = "Bachelors' Thesis"
+++

My bachelor's thesis was about the COLLADA format. Those of you who don't know COLLADA it's a format created with the goal of uniting all graphics software for the benefit of the artist([Wikipedia](http://en.wikipedia.org/wiki/COLLADA) has a very good summary imho).But it's [standard](http://www.khronos.org/collada/) is still under development and the importer/exporter plugins have limited support for features.

So in the thesis,I had to rig and animate(mainly rig though) a fully textured 3D humanoid based on the h-Anim Standard and export it to COLLADA and test how ready it is ,for use, by viewing the exported file in a COLLADA viewer(in this case OpenSceneGraph).There was a second objective,to create a dataset for virtual characters and have one handy for future projects having versions of the humanoids in both joint-based facial animation and blendshape-based facial animation.

As far as tools and files go,The 3D models used were Ryan and Alyson(same dataset I mentioned earlier) from Google's 3D warehouse. I used Maya in order to do so(many thanks to Autodesk for their student alliance).The importer/exporter plugin was openCollada.I mentioned OpenSceneGraph which is the COLLADA viewer.

I came into this project with no graphics background whatsoever,only with the thought that if I want to go into game design I need to know a bit about every field,something my supervisor [Mr.Georgios Papagiannakis](http://george.papagiannakis.org/) was eager to help with by providing me with this learning opportunity.At first the project was hopeless,Maya Tutorials were good but only for those who had the theory down.It took a major study of digital-tutors.com videos to save this project.

Leaving the publicity aside,I rigged Ryan and ,after a lot of work,created both versions needed. At this point,COLLADA does not support blendshapes so the joint-based version was the only one for which exporting and testing was meaningful.The results from exporting though were bad.They revealed weaknesses one should look out for in modelling,texturing and shading.But those were fixable.The error list after exporting ruled out most of the known features riggers and animators use,like Kinematics,Controls,Constraints etc.

The only way to successfully export animation to a COLLADA file is to use a rather extensive joint hierarchy scheme that can simulate the level of detail you want the humanoid to have. The more detail you want the expressions or animations to have,the more joints you must add.In the end you must use a character set for those joints and animate using it so that animation curves are created for all joints.

Here's a link to my [Thesis Report](https://drive.google.com/file/d/1yYxZMeZxo-w49Y_Olo70qiV5dxuq7O4P/view?usp=sharing) ,where everything's explained and every step of the way accounted for ,and to some [Additional Instructions](https://drive.google.com/file/d/1WVA7pNn55sR82rCFS0x0TtZlBZn-0FNT/view?usp=sharing).

Being a novice,I quickly lost count of the times I needed to redo the work. Finding an error in joint positions while skinning for example(UVs were overlapping so I had to rebind and copy weights to redo the work).Generally there were many things I found that at the time seemed like too much work for nothing and I looked the other way.Like UVs overlapping or not using MEL as much etc.In the end they came back to bite me in my respective behind and I regretted I didn't do it earlier.So I finally did,learnt MEL and automated the whole process.What took me twenty minutes of redoing work and probably missing something and redoing it till I got it right now took about 5-10 minutes for the whole thesis to be created and granting full control over fixing.

The result was named "h-Anim Compliant Model Construction Script Framework" and allows for Maya users to quickly construct the whole thesis over any model,but not without restrictions. There are still things ,like say creating the skeleton, that the user must do.However there are scripts in the framework that one can use to take a "snapshot" of things and dump it in the form of a script.i.e. one can use the Skeleton Creation script and as long as there is a joint hierarchy in the scene with HumanoidRoot for the root joint it's going to be written down as a script in the scripts folder inside the project.

You can try downloading the following Maya Projects(an script manual is provided to help with everything from installation to explanation of the script).You will find a scripts folder in both of them where all scripts used in the framework exist.You can tinker with it however you want just make sure to make all necessary changes otherwise you will have to debug it yourself.You can also use it as a reference for your own project.

[MayaProjectFiles](https://drive.google.com/file/d/1LNZNJ-JVXTvxy_XQD7nPoRMwUUVVX3Qc/view?usp=sharing) and [Script Framework Manual](https://drive.google.com/file/d/1DXvexUbdqVnGayjRKEW1wEXsdtNVtxhF/view?usp=sharing)
