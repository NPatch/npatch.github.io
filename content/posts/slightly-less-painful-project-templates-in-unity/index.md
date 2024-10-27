+++
date = '2024-01-02T01:14:00+03:00'
title = 'Slightly less painful Project Templates in Unity'
featuredImage = "projecttemplatedialog.png"
+++

I'm not going to explain how to create project templates. There are a few articles by others floating around in how to structure a `Project Template` package.[^1][^2] What I am going to tell you is how to make this less painful to use. As far as most articles and forum posts are concerned, to make your custom `tgzip` template available to Unity, you must place it in the `Editor\Data\Resources\PackageManager`
`\ProjectTemplates` subfolder of an Editor install.

{{< figure src="image.png" title="Figure 1: Program Files folder with all currently installed Editor versions" width="80%">}}

This is very impractical as whenever you install an Editor version, the project template just isn't there. Not to mention, you have to do a file copy from a previous editor's installation to the newer, which will ask for permission, seeing as it's located under `Program Files`. Generally, messing with `Program Files` is not ideal. Installers handle `Program Files` almost exclusively and have separate persistent storage in `Documents` or `<user>/AppData`.

`Unity Hub` seems to always know about the `Project Templates` available by Unity, for each new version of the Editor. It also seems to know when there's a new project version, that incidentally requires the new Editor version and is not compatible with the older ones (`minversion` property in `package.json`).

So how does it know? Looking through any Unity folder known to Windows users, I stumbled upon a folder under `AppData` which contains `Project Templates` that do not come with the Editor itself.

{{< figure src="image-1.png" title="Figure 2: Unity Hub AppData folder with downloaded ProjectTemplates" width="80%">}}

The `tgz` archives correspond to the templates a user might download through the New Project dialog. The `manifest.json` seems very interesting, considering how it works in a regular project.

This is a prettyfied version of the json file:

```json
{
    "2022.3.16f1": {
        "dependencies": {
            "com.unity.template.vr": "6.0.2"
        }
    },
    "2022.3.5f1": {
        "dependencies": {
            "com.unity.template.urp-blank": "3.0.2",
            "com.unity.template.vr": "6.0.0"
        }
    }
}
```

The `3D (URP)` template, as well as the `VR (Core)` template, has been downloaded for `2022.3.5`. However, for `2022.3.16`, we have just a newer version of the `VR (Core)` template.

One can surmise that if we put our project template package in the same folder (which is editor independent) and register it as a dependency to the current Editor version in the `manifest.json`, it will work. And one would be correct. It indeed does work. But this only solves half the problem. Make the file itself occupy a permanent location in the disk and be available for any editor version, through the path of least resistance. It doesn't however solve the fact that the developer/user will still have to manually edit the `manifest.json` file every time they install a newer(or older) version of Unity and add the custom template as a dependency for it to force Hub to show the template in the `New Project` dialog.

Which begs the question, how does Unity Hub know when a template has a newer version and if it downloads them in this folder, what happens when the version is already downloaded for one editor install but not for another. To answer the latter first, I clicked download for the `3D (URP)` project in `2022.3.16f1` and it basically figured out that the template was already there and instantly updated `manifest.json` to include the template in its dependencies.

At this point, I thought about the former question. Considering how Unity's `Package Manager` works and how Hub seems to emulate it to a point, at least when it comes to project templates having a package structure with a `package.json` and all, it has to have some way to define `Scoped Registries` which allow it to look for available templates remotely and prompt you to redownload them for a new version. If so, we could define our own `Scoped Registry` for the `Hub` once and it should 1) show the package as an entry for new editor installs and 2) force the user to "redownload" for each new editor install, which would be the least path of resistance, being `Hub` UI and seeing as the package would be pretty much the same version (and be already present in the template folder), Hub would just update the `manifest.json` on its own. This `Roaming` Unity Hub directory contains a ton of json configurations. There's bound to be a place to define the registry.

Unfortunately, this is not the case. Searched the directory with `"template"` or `"com.unity.template"` and the only file I found that seemed relevant was a cached json inside a graphql cache folder, which implies that Unity Hub requests everything, including project template availability, through a `graphql` api and cached the response locally. This file should be fairly transient, so there's no point in attempting to inject anything into it.

At the end of the day, it's still less painful to update than `Program Files`, even though both approaches require manual intervention.

That said, I have no idea if Hub's `manifest.json`, can somehow include `scopedRegistries` or anything beyond the default layout we see in the code blocks above, but it should be fairly easy to either allow a version agnostic list of dependencies that gets merged to any editor's template list unconditionally, or perhaps allow for version masks, like `"2022.X"`, which would make it easy to add a template for all subsequent minor versions and releases of the same cycle. That would definitely be a win with low difficulty.

Here is an example:

```json
{
    "2022.3.16f1": {
        "dependencies": {
            "com.unity.template.vr": "6.0.2"
        }
    },
    "2022.3.5f1": {
        "dependencies": {
            "com.unity.template.urp-blank": "3.0.2",
            "com.unity.template.vr": "6.0.0"
        }
    },
    "*": {
        "dependencies": {
            "com.my-company.template.custom-template-1": "1.0.0"
        }
    }
    "2022.*": {
        "dependencies": {
            "com.my-company.template.custom-template-2": "1.0.0"
        }
    }
}
```

When the user installs `2022.3.22f5`, for example, Hub could easily match it to both `"*"` and `"2022.*"` and show them both.

[^1]: [https://www.techarthub.com/how-to-create-custom-unity-project-templates/](https://www.techarthub.com/how-to-create-custom-unity-project-templates/)]
[^2]: [https://fistfullofshrimp.com/unity-create-custom-project-templates/](https://fistfullofshrimp.com/unity-create-custom-project-templates/)
