+++
date = '2024-05-10T15:04:02+03:00'
lastmod = '2024-05-11T11:37:02+03:00'
draft = true
title = 'Obsidian.md : Daily Note template overview and Previous/Next links approach'
+++

https://forum.obsidian.md/t/is-it-possible-to-change-an-already-created-link-from-a-previous-note-with-js/73175/8

Last year I started writing a log of my work which contained daily notes of what I tackled, how I tried to solve it and in case it didn't work, why it didn't. I tend to try multiple things and there are so many combinations of things you might try while trying to solve one or more issues, that sometimes the details slip into the cracks and when asked later on, everything is a blur. Many things come flooding in but nothing concrete so you're not sure enough of your answer. It has happened to me and even though I eventually remembered enough about a specific issue, it didn't happen when I was asked. This is when I looked into note taking apps for more accessible and organized notes and found Obsidian.md.

I then started using it in my last project on a semi-daily basis using organized notes and also daily notes. Organized notes would be a sort of documentation I could build alongside the development, while Daily notes would be the log that contained the details on why certain decisions were taken. Anyone familiar with note taking in apps such as these, you will want to have some extra functionality in each note, like being able to easily traverse the notes around a specific one, since tasks don't always resolve in one day or work session. This is achieved by having [Previous] and [Next] links within the document that open up the relevant note. Such [Previous] / [Next] links are usually created within a template using a plugin like Templater (which is what I used too).

Here's an example of such a template file:
```Markdown
Template Name: Daily Template
[[<%tp.date.yesterday(tp)%>|< Previous]] - [[<%tp.date.tomorrow("YYYY-MM-DD")%>|Next >]]

## Tasks
---
    ```dataviewjs
    const page = dv.page("Tasks Pool");
    await dv.taskList(page.file.tasks
        .where(t=> !t.completed)
        .groupBy(t=> t.section)
    , false)
    ```
## Log
---
### [Project A]
```

It's simple. The Previous and Next links are created first, set to the day before and day after this instance's date. Then we have a section where we use DataView js to display the tasks from a separate Tasks Pool file where I put all my tasks per application for this specific project and each task has a checkbox that can easily be checked off while writing today's log. Finally there's the log itself where I write more detailed explanations.

The problem is that, as I mentioned before, I only wrote semi-daily. Templater, at the time of writing this article, cannot generate [Previous] / [Next] links that link to the last created instance of this template. So when you don't write daily, that creates false links which when clicked, create new daily notes without a template applied that you then have to delete and also have to correct the invalid previous/next links. This is tedious to say the least.

There are multiple solutions out there. One I saw that's versatile, is to use DataView JS in that link to look for the relevant files. This will work under all circumstances. Even if you later decide to create a daily note for an older date, it will automatically work. My only gripe with it is that DataView works forever. It's basically an Update loop which refreshes every X seconds (configuration in Settings) while the document is open. Not to mention refreshing is annoying as it's visible[^1]. 

The solution, I opted for, works only on template generation, runs one time and only deals with the previous link. It updates two links, the currently generated instance's Previous link and the last created note's Next link. The template's Previous/Next section looks like this:

```Markdown
[[<%tp.user.find_last_daily_note(tp)%>|< Previous]] - [[<%tp.user.find_next_daily_note(tp)%>|Next >]]
```

The only difference is the tp.user.find_last_daily_note call. This is my own script. Templater can call into custom javascript methods. You can configure a scripts folder within Settings and set it as default so that when a call is executed to tp.user, it will scan the available js scripts for that method.

```js
function ctimeComparer(a, b) 
{
    if (a.stat.ctime < b.stat.ctime) {
        return 1;
    } else if (a.stat.ctime > b.stat.ctime) {
        return -1;
    }
    // a must be equal to b
    return 0;
}

async function find_last_daily_note (tp) {
    today = null;
    last_created = null;

    const daily_folder = "Daily Notes/";

    const dailies = app.vault.getMarkdownFiles().filter(file=>
        {
            return file.path.startsWith(daily_folder)
            && file.basename != tp.file.title;
        });

    if(dailies.length > 0)
    {
        //Sorts with newest in 0 index
        dailies.sort(ctimeComparer);

        //First element is the previous daily
        last_created = dailies[0];
        //Get its metadata
        const last_created_metadata = app.metadataCache.getFileCache(last_created);
        //Get its links to other files
        const last_created_links = last_created_metadata?.links;
        
        if(last_created_links && last_created_links.length > 0)
        {
            //Find the link that has the Next > display text
            last_created_next_link = last_created_links.find(x=> x.displayText.includes("Next >"));

            if(last_created_next_link){
                //Generate a link to the newly created daily (today's) with the same display text
                const new_link = app.fileManager.generateMarkdownLink(tp.config.target_file, tp.config.target_file.path, null, "Next >");

                //Process the previous note's text and replace the link with the one we just generated
                try {
                    app.vault.process(last_created, (data) => {
                        //console.log("Replacing " + last_created_next_link.original + " with " + new_link);
                        return data.replace(last_created_next_link.original, new_link);
                    })
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }
        }
        return last_created.basename;
    }
    return tp.date.yesterday("YYYY-MM-DD");
}
module.exports = find_last_daily_note;
```

The script itself uses mainly plain Obsidian API. It looks for all Daily Note markdown files within the dedicated Daily Note folder. Sorts them using file creation time and grabs very first which is the last created note. The next part gets the links within that note from its metadata and looks for the Next link. It then generates a new link, replacing the date with our current date and replaces the whole link's text within the file. This seems to be the recommended way to do this. Afterwards we return either the last_created_note's filename or the default templater date for yesterday, which because it's still during the new daily's generation, it will be used to update the new note's Previous link, much like Templater's own date functions.

[^1]: I did mention a DataView JS block in the template, but it was added much later than the Previous/Next link setup approach I will propose. I'm also not sure how I can create references to the same checkboxes within a different file to try and replicate this in a more efficient way. It all depends on how easy it is to reproduce with the Obsidian API alone and onOpen event hooks.