+++
date = '2016-05-30T20:25:45+03:00'
lastmod = '2021-05-30T21:36:45+03:00'
draft = true
title = 'Unity and Kinect v2 : My opinion so far'
+++

I've been working with Microsoft's Kinect v2 SDK in Unity for the past year or so. To be more specific,I've been working with the unity package Microsoft created, for which the last version is from 2014, which means that support ,in the sense of fixing bugs,adding new features or improving the API etc, seems to have stagnated. Whatever problem you find, chances are , it won't get fixed anytime soon.

Some information about the Kinect v2  unity package. It includes some dlls which use the C++ SDK and there's a C# wrapper framework which makes the unmanaged side(C++) accessible to the managed side.

First, most people working with 3D cameras , usually work with event based acquisition but so far , event based aquisition doesn't work well with Unity, which has the polling philosophy deeply ingrained(see Update functions). Therefore, using the polling approach, you are responsible for keeping each frame to reasonable time costs when it comes to acquisition and processing. Kinect v2 has a fixed 30FPS rate of giving you frames, while you keep stressing over 60FPS  for the application. The most straight forward way to deal with this is to be able to acquire the frame data AND process them in less than 16ms. But that is not always possible. At least, it's very difficult especially when you want frames from multiple sources ( e.g.  Depth,Body,BodyIndex,Color) in an AR application.

I have some problems with the combination of SDK and Unity when it comes to performance.

1) Using frame functions that end up with Array(for example, [ColorFrame.CopyConvertedFrameDataToArray](https://msdn.microsoft.com/en-us/library/windowspreview.kinect.colorframe.copyconvertedframedatatoarray.aspx)).

This means that you always allocate a new array and also copy over the data to that new array and then assigning that new allocation to the buffer you have, leaving the old array in mem space to get collected by the Garbage Collector.

This is so wasteful and there are fortunately functions in the SDK that allow you to use an IntPtr (ColorFrame.CopyConvertedFrameDataToIntPtr). The reason this is useful is that you can allocate memory upfront and pin it using a GC.Handle so that the GC ignores that mem address space until you free it yourself. All of the above combined, you can preallocate memory and just copy over data using the pointer to that preallocated buffer and avoid allocation costs.

2) The color format has to be converted to whatever you like, per frame.

Normally, people will go for RGBA or BGRA. But it seems that due to bandwidth concerns the sensors default to YUV2 which takes up half the pixels in width to display the same info.

But, as it turns out, sometimes you get color data in YUV2 format. Now, YUV2 is a compressed format which requires half the pixels in width in order to show the same image.

And this is the pickle, YUV2 is not supported by Unity  and therefore you cannot sample YUV2 textures in shaders.

So in the end, you have to use CoordinateMapper.CopyConverted.... functions to convert the YUV2 color data into RGBA/BGRA etc.

If you get your color data in BGRA/RGBA by default, you are lucky indeed. You can use the

CopyRawColorFrameData... functions that only copies the data over. Combined with pinned memory this becomes hell of a lot faster, especially due to dealing with

1920x1080 resolution color frames.

3) The amount of time it takes to copy the converted buffer,release the frame and load it in the Texture2D, done 3 times for Color,Depth,BodyIndex, is a big issue. You end up with spikes in frame time, where it takes up to 16ms to do the above.

Either you pay the price of loading all frames as Texture2Ds and doing things in the shader, or you pay the price of using CoordinateMapper to its fullest. Both situations are bad.