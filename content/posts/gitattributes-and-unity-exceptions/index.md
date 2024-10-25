+++
date = '2024-04-29T20:13:00+03:00'
title = '.gitattributes and Unity : Exceptions'
+++

There are various resources on this issue. I won't be covering what to track in a Unity project in this post. This is more of a follow-up to a [previous post]({{< ref "unitys-terraindata-and-gitattributes" >}}) of mine, with updated info. There's a very good GitHub gist[^1] about what to track with lfs in a Unity project, where I also posted, but I wanted to rewrite it here for my own archive and as a backup for posterity.

Unity, as we know, uses `.asset` for all `ScriptableObjects` and some of its own constructs, all of which are serialized in `YAML`, ie text. What I want to talk about is the exceptions to the rule[^2]. The exceptions to this rule, at least at the time of writing this post and to my knowledge, are 3:

* [TerrainData](https://docs.unity3d.com/ScriptReference/TerrainData.html)

* [LightingDataAsset](https://docs.unity3d.com/ScriptReference/LightingDataAsset.html)

* [NavMeshData](https://docs.unity3d.com/ScriptReference/AI.NavMeshData.html)

These 3 are all serialized as binary file(s) and they all have their own quirks.

[`TerrainData`](https://docs.unity3d.com/ScriptReference/TerrainData.html) is created when we add a [`Terrain`](https://docs.unity3d.com/ScriptReference/Terrain.html) gameObject to the scene and takes the name `New Terrain.asset`. It's linked to the [`Terrain`](https://docs.unity3d.com/ScriptReference/Terrain.html) component and the asset itself can be moved and renamed. Initially it's dumped in `Assets` but can work from anywhere, if moved.

[`LightingDataAsset`](https://docs.unity3d.com/ScriptReference/LightingDataAsset.html) is auto-generated when we bake the lighting in a scene and the auto-generation creates a folder with the same name as the scene and dumps the [`LightingDataAsset`](https://docs.unity3d.com/ScriptReference/LightingDataAsset.html) file within it. It's named `LightingData.asset` and the folder differentiates it from other scenes' lighting data assets, since they all have the same name. You can rename the asset, but this usually breaks the connection of the asset and the renderers within the scene[^3]. Renaming the asset, back to the original, doesn't fix it. You have to rebake the lighting. But that's not all. Any regeneration of lighting, whether you choose to clear the baked data or not, will rename the file back to `LightingData.asset`. Therefore, there's no point fighting the "system". The asset also links to various .exr files which are textures in nature and can be tracked normally as binary, like any other texture.

[`NavMeshData`](https://docs.unity3d.com/ScriptReference/AI.NavMeshData.html) is created when we add a [`NavMeshSurface`](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/api/Unity.AI.Navigation.NavMeshSurface.html) component to a gameObject in the scene and click on `Bake`. This generates an asset with the name `NavMesh-<insert gameObject name>.asset`. You can also rename it, but it gets regenerated with the original name when you rebake. What's interesting is that [`NavMeshData`](https://docs.unity3d.com/ScriptReference/AI.NavMeshData.html) are generated in different locations,based on context. If they are added on an existing GameObject within a scene, the generated asset is stored in a folder with the scene's name, much like [`LightingDataAsset`](https://docs.unity3d.com/ScriptReference/LightingDataAsset.html). If we create a new prefab somewhere in the `Assets` folder and open the prefab context scene, then the new [`NavMesh`](https://docs.unity3d.com/ScriptReference/AI.NavMesh.html) is generated next to the prefab and there might be more edge cases but I didn't need to delve deep into it. The important point is that it's pointless to move things around if they haven't finalized, since they will be regenerated.

As you can see, there's no consistency in behavior across all of them, which means they have to be treated slightly differently.

`.gitattributes` rules are executed in order and priority is given to the last matching rule. Meaning, two rules whose patterns match the same file, will execute in order, but the latter is the one that actually affects the file.

So my recommendation is:
```.gitattributes
*.asset merge=unityyamlmerge eol=lf
*TerrainData.asset filter=lfs diff=lfs merge=lfs -text
LightingData.asset filter=lfs diff=lfs merge=lfs -text
NavMesh-*.asset filter=lfs diff=lfs merge=lfs -text
```

Say we have a terrain data file called `SomeScene_TerrainData.asset`. By default, the first rule will treat it as text. But, provided we have kept a naming convention that matches the rule, the specific rule will also match and treat the file as binary and to be tracked by lfs. Obviously, the TerrainData naming convention is up to you, just make sure the specific rule matches it.

One more thing I want to talk about is a nifty little tool I found out about while looking into this, called [`git check-attr`](https://www.git-scm.com/docs/git-check-attr). As the name suggests, it outputs attribute information about a file. `filter`, `diff`, `merge`, `-text` are all attributes.

Let's use the terrain file from before and run the following in cmd:
```cmd
 git check-attr -a SomeScene_TerrainData.asset
```

Running the command above will display all attributes associated with this file:

{{< figure src="image.png" width="100%" >}}

The result shows all the attributes we associated with the `TerrainData` rule, where `filter`, `diff` and `merge` are all set to `lfs`. `text` is also `unset` (meaning we wrote the `-text` in the rule, explained as "not text") so the end-of-line attribute having the line feed option doesn't affect the file.

Had we not added `-text` in the end, the line ending normalization[^4] would have corrupted the file and we would have been able to figure it out from this info dump, just as much as, in the case of an unexpected rule being used. If the file had matched the generic `.asset` rule, none of the above attributes would have been set to `lfs` and the text attribute would be set.

Additionally, you can test for a specific attribute by replacing `-a` with the name of the attribute you want. For example, `git check-attr text SomeScene_TerrainData.asset` would give us `text: unset`.

If you're still up for further reading, I recommend this [comprehensive post](https://www.chunfuchao.com/posts/unity-git-en/#gitattributes) by {{< person url="https://github.com/FrankNine" name="Chao Chun-Fu" nick="FrankNine">}}.


[^1]: [ .gitattributes for Unity3D with git-lfs](https://gist.github.com/nemotoo/b8a1c3a0f1225bb9231979f389fd4f3f)
[^2]: This is a painful part about having the same extension for both text and binary assets. I first came to know about this in a project where I added lfs and back then I didn't know about these exceptions being binary, so I added .asset to be treated as text. This corrupts binary files due to a feature git uses, called end-of-line normalization, which basically tries to convert line feeds to whatever preset you have set (e.g. lf to crlf), which basically scours the bytes of a file and when it finds a sequence of bytes that matches the line feed it wants to eradicate, it changes those bytes. In a binary file, this spells corruption. Couple it with git and someone with no knowledge of the file being binary in nature and you have countless hours of head scratching, cursing at the screen and forum posts trying to figure out why.
[^3]:  assume, it's something similar to how animation stores paths of bones and when one gets renamed, the animation clip gets corrupted.
[^4]: More info in [Git and normalization of line-endings](https://dev.to/kevinshu/git-and-normalization-of-line-endings-228j)