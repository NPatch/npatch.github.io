+++
date = '2015-05-28T15:54:00+03:00'
title = 'Adding a custom sidebar to Github Wiki with automated ordering based on line entries'
+++

This is a small and trivial thing but surprisingly there's no guide to do it.

Writing wikis you likely want to establish a specific reading order for your pages.

The `Pages` dropdown widget contains all pages with an alphabetical order and its the default `Sidebar/Table of Contents` that Github Wikis provide. There's no ready solution to custom ordering by `Github` wikis. Even though something like reordering by dragging Pages around in the Pages widget would be trivial for the `Github` wizards to make...

In order to create your very own and custom `Table of Contents` with auto updated ordering depending on the line you define each entry, create a custom `Sidebar` exactly like `Github` suggests.

In the main body write :
```markdown
//Edit <Username> and <Project Name> to reflect your situation
1.[Home](https://github.com/<Username>/<Project Name>/wiki)
+ [<FirstPageName>](https://github.com/<Username>/<Project Name>/wiki/<FirstPageName>)
+ [<SecondPageName>](https://github.com/<Username>/<Project Name>/wiki/<SecondPageName>)
+ [<ThirdPageName>](https://github.com/<Username>/<Project Name>/wiki/<ThirdPageName>)
```
<br/>
Ordering starts from index 1 with the Home page which is the default wiki entrance. Everything else will just get the +