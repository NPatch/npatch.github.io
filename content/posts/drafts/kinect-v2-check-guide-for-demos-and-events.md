+++
date = '2017-07-02T20:39:29+03:00'
lastmod = '2021-12-07T21:36:29+03:00'
draft = true
title = 'Kinect v2 Check Guide for Demos and Events'
+++

Disclaimer:  I encourage anyone to correct me and especially to add to the list. Also,I'm not an expert so I won't be able to explain all issues well but I think I will be able to explain the problems and what I found the solution was about which makes sense to me.

Kinect v2 development can be fun but it can very easily get frustrating. Kinect v2 was designed for indoor spaces ,mainly at home, and as few people as possible(1-6). That said, it can be used in other cases, such as showcasing an application at an event or creating interactive applications for shops etc.

Among the many problems you might encounter during your app development, are problems that have to do with the Near IR sensor/camera used by Kinect in order to understand space and depth in front of it.

If you remember the times where we had to use IR to send files between mobile phones, you'll remember how frustratingly easy it was to lose connection. That's because IR is prone to reflection,refraction and absorption. So we can immediately say, that any material that has one or all of the above effects to IR, or at least to an extensive enough degree, will mess our demo.

Reflection

Say you have a demo set up and a user is wearing a jacket with all kinds of glossy stuff so that reflection will happen in a way that most beams won't make it back. Had it happen to me once. Two users appear and one of them wore such a jacket. The user with the glossy jacket could not interact. His skeleton could not be tracked, AT ALL. Well not that weird. Kinect does try to use shoulders and head to define a candidate user. Not being able to see the shoulders, a user will go untracked. As soon as I asked the user to remove the jacket, he was tracked properly and could then interact with the application.

Refraction

A usual case where Kinect can very much falter is when glass is placed between the sensor and the user. Such cases involve applications developed to be placed in storefronts. Depending on the type of glass, the refraction index can vary. Sometimes that index is high enough to divert the beam so much it cannot return back. Only when placed exactly adjacent to the glass surface , did it work. Sometimes it might not work well, but most times it will. Beams at the center of the IR enter the glass in a way that minimizes the refraction for some of the beams.

Absorption

The color Black is a usual suspect. This effect can be seen on non reflective black fabrics(black jeans for example) and many a time on hair(beards as well). Have a user with black hair stand in front of a Kinect and check the BodyIndex. You will see lots of background pixels around the edge of the hairline and inside the beard as well.