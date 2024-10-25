+++
date = '2018-03-30T22:56:00+03:00'
title = 'Unity’s TerrainData and .gitattributes'
+++

{{< admonition type="warning" title="UPDATE" >}}
There is a [newer post]({{< ref "gitattributes-and-unity-exceptions" >}}) about this topic which covers more things about the core issue, a solution and how to debug it.
{{< /admonition >}}

It’s been a long time since my last post but this is one of those situations where a decision from the past, seemingly harmless, comes back to bite you in the a**. Having lost 5 afternoons trying to figure out why, I’ll write about it so others can benefit and avoid the waste of time and frustration.

So I joined a game project and among the commits, I added a `.gitattributes` which had various rules for unity extensions(.mat, .unity etc) which normalized line endings, since the project had forced text serialization to be friendly to `git`.

At some point, someone committed changes to a `terrain file`. I got curious and tried to preview the changes in SourceTree. But I only got the warning about it either being binary or being too large.

Problem was that after that commit, the `TerrainData` file in Unity was broken somehow. Inspecting the issue, I found out that the commit author had done nothing to the file but it was modified by Unity due to a prompt about Unity version being changed. So he committed the file. The initial response was to find a previous commit with a healthy version of the file and recommit it. At first the file was ok for some of us, but then it was somehow broken again in a subsequent commit.

In SourceTree, the warning claimed it was either `large` or `binary`. It was definitely not that large, so it had to be binary. But `.asset` is used in various other constructs, `ScriptableObjects` included which are serialized in text. Also the `.gitattribute` rules specify that the “.asset” extension is to be treated as text. Unfortunately it’s not documented that even with force text serialization, the `TerrainData` file specifically will remain in binary form. I only found out due to a single Unity forum thread.

Even so, what’s the problem? It’s binary and SourceTree just can’t preview changes. So why does it break as an asset? Where’s the problem?

As I looked into the rule switches due to a hunch, I found that `line ending normalization` modifies the file before preview which ,to be honest, I didn’t know. I thought it was only used for previewing changes without altering the source file. It’s probably my fault for not being too careful, but on the other hand, all other constructs in Unity can be serialized in text. This is such an obscure case.  I can understand the need for it to remain in binary, so why not use a different extension as it’s a special case?

As I googled about it more specifically I found a link to a Github Issue where someone else had the same issue and figured it out, so my fears were verified.

Luckily, there is a solution in which you don’t have to remove a rule that works well for 99% of the cases. In `.gitattributes`, you can specify an override rule using a pattern (like `*Terrain*.asset`) in a line below the `*.asset text eol=lf` rule. So whenever you try to preview a file with a “.asset” extension which also happens to have the word `Terrain` in its name, it will use the override rule,due to order of execution for the rules.