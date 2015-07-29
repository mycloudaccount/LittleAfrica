/****************************************
	SimpleRenameTool.js v1.0
	Copyright 2014 Unluck Software	
 	www.chemicalbliss.com																			
*****************************************/
import System.Collections.Generic;
class SimpleRenameTool extends EditorWindow {
	var _replace: String = "";
	var _replaceWith: String = "";
	var _counter: int;
	var _addString: String = "";
	var _rename: String = "GameObject";
	var _addToNumerate: String;
	var _numerateStep: int = 1;@
	MenuItem("Window/SimpleRenameTool")
	static

	function ShowWindow() {
			var win = EditorWindow.GetWindow(SimpleRenameTool);
			win.title = "SimpleRenameTool";
			win.minSize = new Vector2(250, 420);
   			win.maxSize = new Vector2(250, 420);
		}
	

	function Rename() {
		_selection = Selection.transforms; //Add selection to array
		for (i = 0; i < _selection.Length; i++) {
			Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "Rename");
			var p: float = i;
			EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", p / _selection.Length);
			_selection[i].name = _rename;
		}
	}

	function ReplaceName() {
		_selection = Selection.transforms; //Add selection to array
		for (i = 0; i < _selection.Length; i++) {
			Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "Rename");
			var p: float = i;
			EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", p / _selection.Length);
			var n: String = _selection[i].gameObject.name;
			n = n.Replace(_replace, _replaceWith);
			_selection[i].name = n;
		}
	}

	function AddString(type: String) {
		_selection = Selection.transforms; //Add selection to array
		for (i = 0; i < _selection.Length; i++) {
			Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "Rename");
			var p: float = i;
			EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", p / _selection.Length);
			var n: String = _selection[i].gameObject.name;
			if (type == "suffix") n = n + _addString;
			else if (type == "prefix") n = _addString + n;
			_selection[i].name = n;
		}
	}

	function Numerate(type: String) {
		_selection = Selection.transforms; //Add selection to array
		for (i = 0; i < _selection.Length; i++) {
			Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "Rename");
			var p: float = i;
			EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", p / _selection.Length);
			var n: String = _selection[i].gameObject.name;
			if (type == "suffix") n = n + _addToNumerate + (_counter + (i * _numerateStep)).ToString("000");
			else if (type == "prefix") n = (_counter + (i * _numerateStep)).ToString("000") + _addToNumerate + n;
			_selection[i].name = n;
		}
	}

	function RemoveChar(type: String) {
		_selection = Selection.transforms; //Add selection to array
		for (i = 0; i < _selection.Length; i++) {
			Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "Rename");
			var p: float = i;
			EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", p / _selection.Length);
			var n: String = _selection[i].gameObject.name;
			if (n.Length > 1 && type == "last") {
				n = n.Remove(n.Length - 1);
				_selection[i].name = n;
			}
			else if (n.Length > 1 && type == "first") {
				n = n.Remove(0, 1);
				_selection[i].name = n;
			}
		}
	}
	
	 function SavePrefabs() {
        if (Selection.gameObjects.Length > 0) {
            var path = EditorUtility.SaveFolderPanel("Select Folder ", "Assets/", "");
            if (path.Length > 0) {
                //Debug.Log(Application.dataPath);
                if (path.Contains("" + Application.dataPath)) {
                    var s: String = "" + path + "/";
                    var d: String = "" + Application.dataPath + "/";
                    var p: String = "Assets/" + s.Remove(0, d.Length);
                    var _selection = Selection.transforms;
                    var cancel: boolean;
                    for (i = 0; i < _selection.Length; i++) {
                    	var x: float = i;
						EditorUtility.DisplayProgressBar("Replacing String in GameObject Name", "", x / _selection.Length);
                        if (!cancel) {
                            if (AssetDatabase.LoadAssetAtPath(p + _selection[i].gameObject.name + ".prefab", GameObject)) {
                                //			var goName:String = go.name;

                                //					var i:int = go.name String. go.name.Length-1];
                                //				Debug.Log(i);
                                var option = EditorUtility.DisplayDialogComplex("Are you sure?", "" + _selection[i].gameObject.name + ".prefab" + " already exists. Do you want to overwrite it?", "Yes", "No", "Cancel");

                                switch (option) {
                                case 0:
                                    CreateNew(_selection[i].gameObject, p + _selection[i].gameObject.name + ".prefab");
                                case 1:
                                    break;
                                case 2:
                                    cancel = true;
                                    break;
                                default:
                                    Debug.LogError("Unrecognized option.");
                                }

                            } else
                                CreateNew(_selection[i].gameObject, p + _selection[i].gameObject.name + ".prefab");
                        }
                    }
                } else {
                    Debug.LogError("Prefab Save Failed: Can't save outside project: " + path);
                }
            }
        } else {
            Debug.LogWarning("No GameObjects Selected");
        }
    }
    
	static
    function CreateNew(obj: GameObject, localPath: String) {
        var prefab: Object = PrefabUtility.CreateEmptyPrefab(localPath);
        PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ConnectToPrefab);
    }
    
	function OnGUI() {
		////////////////////////////////////////////////////////////////////////////// R
		GUILayout.Space(20);
		_rename = EditorGUILayout.TextField("", _rename);
		if (GUILayout.Button("Rename")) {
			this.Rename();
		}
		
		////////////////////////////////////////////////////////////////////////////// REPLACE
		GUILayout.Space(10);
		_replace = EditorGUILayout.TextField("Replace in Name", _replace);
		_replaceWith = EditorGUILayout.TextField("Replace with", _replaceWith);
		if (GUILayout.Button("Replace In Name")) {
			this.ReplaceName();
		}
		GUILayout.Space(10);
		
		////////////////////////////////////////////////////////////////////////////// NUMBERS
		_counter = EditorGUILayout.IntField("Start Number", _counter);
		if (_counter < 0) _counter = 0;
		_numerateStep = EditorGUILayout.IntField("Numerate Step", _numerateStep);
		if (_numerateStep < 1) _numerateStep = 1;
		_addToNumerate = EditorGUILayout.TextField("Numerate Character", _addToNumerate);
		if (GUILayout.Button("Numerate Suffix")) {
			this.Numerate("suffix");
		}
		if (GUILayout.Button("Numerate Prefix")) {
			this.Numerate("prefix");
		}
		GUILayout.Space(10);
		
		////////////////////////////////////////////////////////////////////////////// REMOVE
		if (GUILayout.Button("Remove First Character")) {
			RemoveChar("first");
		}
		if (GUILayout.Button("Remove Last Character")) {
			RemoveChar("last");
		}
		GUILayout.Space(10);
		
		////////////////////////////////////////////////////////////////////////////// ADD
		_addString = EditorGUILayout.TextField("Add to Name", _addString);
		if (GUILayout.Button("Add Prefix")) {
			this.AddString("prefix");
		}
		if (GUILayout.Button("Add Suffix")) {
			this.AddString("suffix");
		}
		GUILayout.Space(10);
		
		////////////////////////////////////////////////////////////////////////////// SAVE
		 if (GUILayout.Button("Save Prefabs")) {
        	SavePrefabs();
        }
		
	}

	function OnInspectorUpdate() {
		//   Repaint();
		EditorUtility.ClearProgressBar();
	}
}