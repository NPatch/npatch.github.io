+++
date = '2014-11-26T22:42:00+03:00'
title = 'An Easy Framework for Component Data Customization and Testing'
+++

Some times in our games we might have multiple objects with a multitude of data for which we'd like to have multiple files with different configurations for our component in order to find the best/most balanced/.. configuration. For the sake of explaining let's use the Abilities and Attributes tab from Shadows of Mordor or the Perk trees of The Elder Scrolls V : Skyrim.

{{< figure src="shadow-of-mordor-abilities-list.jpg" title="Abilities Menu in Shadows of Mordor" width="65%">}}

{{< figure src="shadowofmordor-attributes.jpg" title="Attributes List in Shadows of Mordor" width="65%">}}

{{< figure src="skyrim-perks-menu.jpg" title="Perks Menu in The Elder Scrolls V : Skyrim" width="65%">}}

In the Abilities list of Shadows of Mordor we have a graph structure with each node unlocking an ability for us to use. But as you can see we have a specific layout when it comes to how things are positioned which has a direct effect on the graph's nodes and especially the graph's edges which show how the nodes are connected to each other and upon which nodes a given node depends. Of course one can see it as a two dimensional array but in the case of the Perks Menu in Skyrim we do not have such an easy representation codewise.

So when the designers of the game sat down to create that list they might have made some corrections/changes/insertions along the way. Of course in major developers like Monolith Productions or Bethesda Softworks, the designers might have already devised the abilities themselves and laid them out beforehand in the Game Design Document, way before it hits the Art or the Engineering team.

However, in smaller studios there might not be such a process. So you want to create editor tools for your designers to start creating and testing things, or even make corrections/changes/insertions later on, in the development stage.

A good idea is to be able to support configuration files.

At this point, the project I'm working on doesn't have a save/load system and it will be a while before we can do that, especially since not all systems are ready. So a way to do these things with very little fuss , and gradually supporting a potential Save/Load system, is to write an Editor for the component type and save it's configuration to an asset file using the AssetDatabase.

{{< figure src="inspectoreditor.jpg" title="Visual example of asset files being used" width="65%">}}

Asset files are good when it comes to Editor-RuntimeComponent communication since they are supported by the UnityEngine for drag and dropping on a GUI Object Field. Thus the easy testing of the configurations. Basically Asset files in our case are ScriptableObjects(or their derivations) that have been serialized into files by the UnityEngine. Another good point is that since they are serialized by the engine itself, you can "inspect" the contents of the asset files and also edit them. Word to the wise, if you're going to create a custom editor for the component, you'd probably leave the editing to the custom editor since your manual edits might break something where your custom editor will have checks.

Another good idea is to bundle up data in classes or structs(whichever is good in your situation) per their usage. You might have data you only need in your component's editor class, or data just for the runtime, or data just for the frontend of your component(In Shadows of Mordor we could have a structure for the frontend containing Row, Column, Texture info for a 5x10 "array" in order to render the texture of a specific ability in a specific cell of the "array", or at least its a possible solution). If you keep your data in such bundles, you can separate your runtime data, data that can change and that will need to be saved when you implement your Save/Load system. They can also be loaded back very easily. If both your asset file and your savegame files share the same structure, your component can use the same functions to load from them.

Here's an example:

```csharp
public class StatisticsController : Monobehaviour
{
    private StatisticsData data;

    //We use this in an initialization function to grab the initial data
    //when we start a new game.If we want to load a game we leave this
    //unless we have other kinds of info stored that don't change
    //between savegame files.
    [SerializeField]
    public StatisticsTemplate _configuration;

    //Using start for the example but you do this wherever makes sense
    void Start()
    {
        //.....other initialization commands
        if(GameMode.NEWGAME){
            //Copy over data from _configuration to data
        }
        else if(GameMode.LOADGAME){
            //copy data from the save game file to data
        }
        //....other initialization commands
    }
    ...
}
```

```csharp
//This is what is serialized in the asset form.
[System.Serializable]
public class StatisticsTemplate : ScriptableObject
{
    [SerializeField]
    public StatisticsData runtimeData;
    [SerializeField]
    public StatisticsEditorData editorData;

    public void OnEnable()
    {
        if(runtimeData == null){
            runtimeData = new StatisticsData();
        }
        if(editorData == null){
            editorData = new StatisticsEditorData();
        }
    }
}
```

```csharp
//Runtime Data
//Having them bundled this way is good because we can use this
//structure both for our editor template and for when we want to
//serialize or deserialize them from a save game files.
[System.Serializable]
public class StatisticsData 
{
    [SerializeField]
    public int A;
    [SerializeField]
    public int[] B;
}
```

```csharp
//Data used for reloading the component editor's state in order
//to resume editing seamlessly.
[System.Serializable]
public class StatisticsEditorData 
{
    [SerializeField]
    public int C;
    [SerializeField]
    public List<string> D;
}
```

None of the above are functional though without using custom editors in order to create the tools with which your designers will use to test out things. A custom editor using asset files has some responsibilities, like always have an asset file being used even if that means creating a new one. So if we have none, create one. If we have one assigned to the object field, try to load it. Check for null where you have to, call new where you have to etc.

I've found the following template of code works for me quite well:

```csharp
[Serializable]
[CustomEditor(typeof(StatisticsController))]
public class StatisticsControllerEditor : Editor
{
    private const string statisticsPath="Assets/Resources/Statistics/";

    private StatisticsController self = null;

    public void OnEnable()
    {
        self = (StatisticsController)target;

        if (self._configuration == null)
        {
            string assetPathAndName = statisticsPath + "/" +
            typeof(StatisticsTemplate).ToString()
            + "_New.asset";
            self._configuration=(StatisticsTemplate)(
            AssetDatabase.LoadAssetAtPath(assetPathAndName,
            typeof(StatisticsTemplate)));

            if (self._configuration == null)
            {
                self._configuration = CreateInstance<StatisticsTemplate>();
                AssetDatabase.CreateAsset(self._configuration,assetPathAndName);
                AssetDatabase.SaveAssets();
            }
        }
    }

    public override void OnInspectorGUI ()
    {
        //important:remember to set allowsceneobjects to false since we
        //only want files from the project hierarchy
        self._configuration = (StatisticsTemplate)
        (EditorGUILayout.ObjectField("Statistics Template:",
        self._configuration,typeof(StatisticsTemplate), false));

        if (GUILayout.Button("Open Template Editor"))
        {
        //Instead of an Undo functionality we pass two save function
        //delegates here because we would like the window to have its own
        //context in case we'd want to scrap the progress we've made but
        //still preserve the already saved work.Also we can backup the
        //asset files for good measure,which is another nice thing to have.
        StatisticsEditor edWin = new StatisticsEditor();
        edWin.ShowWindow(self._configuration,Save,SaveAs);
    }

    if (GUI.changed)
        EditorUtility.SetDirty(self);
    }

    private void Save(int A,int[] B,int C,List<string> D)
    {
        self._configuration.editorData.C = C;
        self._configuration.editorData.D = new List<string>(D);
        self._configuration.runtimeData.A = A;
        self._configuration.runtimeData.B = B;

        EditorUtility.SetDirty(self._configuration);
        AssetDatabase.SaveAssets();
        EditorUtility.SetDirty(self);
    }

    private void SaveAs(int A,int[] B,int C,List<string> D)
    {
        string assetPath = EditorUtility.SaveFilePanel(
        "Save statistics scheme as...",
        statisticsPath + "/",
        "StatisticsTemplate_" + self.name + ".asset",
        "asset");

        assetPath = assetPath.Remove(0,
        assetPath.LastIndexOf(statisticsPath));

        if (assetPath != null || assetPath != "")
        {
        //Saving previously handled file to be sure
        AssetDatabase.SaveAssets();
        //Creating a new one
        self._configuration = new StatisticsTemplate();
        AssetDatabase.CreateAsset(self._configuration,
        assetPath);
        self._configuration.editorData.C = C;
        self._configuration.editorData.D = new List<string>(D);
        self._configuration.runtimeData.A = A;
        self._configuration.runtimeData.B = B;

        EditorUtility.SetDirty(self._configuration);
        AssetDatabase.SaveAssets();
        EditorUtility.SetDirty(self);
        }
    }
}
```

and the Editor Window where all the editing magic happens:

```csharp
public delegate void StatisticsEditorSaveDelegate
(int A, int[] B, int C, List<string> D);

[Serializable]
public class StatisticsEditor : EditorWindow
{
    #region Window Specifics
    private Vector2 scrollPos;
    #endregion

    #region Data Structures
    private int A;
    private int[] B;
    private int C;
    private List<string> D;
    #endregion

    #region Event System
    public event StatisticsEditorSaveDelegate saveClicked;
    public event StatisticsEditorSaveDelegate saveAsClicked;
    #endregion

    public void ShowWindow(StatisticsTemplate template,
    StatisticsEditorSaveDelegate save,
    StatisticsEditorSaveDelegate saveAs)
    {
        #region Register Events
        saveClicked += save;
        saveAsClicked += saveAs;
        #endregion

        #region Load Data
        //A simplistic way of sanity check to see if this is a newly
        //constructed template
        if (template.runtimeData.D == null)
        {
            C = 0;
            D = new List<string>();
            A = 0;
            B = new int[];
        }
        //else we have data to pull from the template
        else
        {
            C = template.editorData.C;
            D = new List<string>(template.editorData.D);
            A = template.runtimeData.A;
            B = template.runtimeData.B;
        }
        #endregion

        #region Instatiate Window
        StatisticsEditor instanceWindow =
        (StatisticsEditor)EditorWindow.GetWindow(typeof(StatisticsEditor));
        #endregion
    }

    public void OnDestroy()
    {
        //Usually clear lists and dictionaries here for good measure
        D.Clear();
        D = null;
    }

    public void OnGUI()
    {
        scrollPos = EditorGUILayout.BeginScrollView(scrollPos);

        GUILayout.Space(10);
        //Following is the bar that holds the save and saveAs
        //buttons which ShowWindow has hooked with the
        //StatisticsEditors Save and SaveAs functions that actually
        //do the saving.So each time you open the editor window
        //and edit you have to click on either of these to actually
        //save the work.
        GUILayout.BeginHorizontal(EditorStyles.toolbar);
        if (GUILayout.Button("Save", EditorStyles.toolbarButton))
        {
            //Execute Save logic here
            OnSave();
        }
        if (GUILayout.Button("Save As..", EditorStyles.toolbarButton))
        {
            OnSaveAs();
        }

        GUILayout.FlexibleSpace();
        GUILayout.EndHorizontal();

        //...Here you put the input fields using EditorGUILayout API

        if (GUI.changed)
        {
            //Here we don't call SetDirty as it defeats the purpose
            //of hooking up save delegates from the StatisticsEditor
            //,so just repaint when changes occur.
            Repaint();
        }
        EditorGUILayout.EndScrollView();
    }
}
```

Now you can create as many asset files you need with different configurations, change them very fast and compare between the results.

{{< admonition type="note">}}
This way of doing things works only for PODs(Plain Old Data). It won't work with references of scene objects(any Monobehaviour). It might work at first, while you are in the same session of the Unity engine(basically uses InstanceIDs to keep references), but as soon as you restart the editor the references will be gone leaving just the rest of the data and a broken asset file for you. In the case that you want to store references you'd better use the engine's serialization system by using SerializedObjects and SerializedProperties. Of course if you'd like to change this reference based on the configuration file you'll have to do it manually or automate it through the editor somehow.
{{< /admonition >}}
