/****************************************
	TileTool.js v1.2
	Copyright 2015 Unluck Software	
 	www.chemicalbliss.com
*****************************************/
import System.Collections.Generic;
class TileTool extends EditorWindow {
	var prevPosition: Vector3;
	var doSnap: boolean = false;
	var snapValue: float = 0.5;
	var _warned: boolean = false;
	var _replaceObject: GameObject;
	var _styleGO: GameObject;
	var _selection: Transform[];
	var _autoSnapMax: int = 50;
	var _style: TileStyles;
	var _tileCycleCounter: int = 0;
	var _index: int = -1;
	var styleNames: String[];
	var styles: TileStyles[];
	var _toggleStyle: boolean = false;
	var _toggleReplace: boolean = false;
	var _toggleRemove: boolean = false;
	var _toggleSnap: boolean = false;
	var _toggleGroup: boolean = false;
	var _toggleMove: boolean = false;	
	var _toggleHelpStyles: boolean = false;
	var _toggleHelpSides: boolean = false;
	var _toggleHelpMove: boolean = false;
	var _toggleHelpGroups: boolean = false;
	var _toggleHelpReplace: boolean = false;
	var _toggleHelpSnap: boolean = false;
	
	@MenuItem("Window/TileTool")
	static function ShowWindow() {
		var win = EditorWindow.GetWindow(TileTool);
		win.title = "TileTool";
		win.minSize = Vector2(200, 300);
		win.maxSize = Vector2(200, 1000);
	}


	function ToggleAll() {
		_toggleMove = _toggleStyle = _toggleReplace = _toggleRemove = _toggleSnap = _toggleGroup = true;
	}

	function OnEnable() {
		RefreshStyles();
	}
	
	function OnLostFocus() {
		_toggleHelpSnap = _toggleHelpReplace = _toggleHelpGroups = _toggleHelpStyles = _toggleHelpSides = _toggleHelpMove = false;
	}
	
	function OnGUI() {
		var _miniButtonStyle: GUIStyle;
		_miniButtonStyle = new GUIStyle(GUI.skin.button);
		_miniButtonStyle.fixedWidth = 24;
		_miniButtonStyle.fixedHeight = 24;
		_miniButtonStyle.fontSize = 12;
		_miniButtonStyle.margin = RectOffset(3, 3, 3, 3);		
		var _mediumButtonStyle: GUIStyle;
		_mediumButtonStyle = new GUIStyle(GUI.skin.button);
		_mediumButtonStyle.fixedWidth = 81;
		_mediumButtonStyle.fixedHeight = 24;
		_mediumButtonStyle.fontSize = 9;
		_mediumButtonStyle.margin = RectOffset(3, 3, 3, 3);	
		var _bigButtonStyle: GUIStyle;
		_bigButtonStyle = new GUIStyle(GUI.skin.button);
		_bigButtonStyle.fixedWidth = 174;
		_bigButtonStyle.fixedHeight = 24;
		_bigButtonStyle.fontSize = 9;
		_bigButtonStyle.margin = RectOffset(3, 3, 3, 3);	
		var _mainBox: GUIStyle;
		_mainBox = new GUIStyle(GUI.skin.customStyles[0]);
		_mainBox.fixedWidth = 200;	
		var _helpStyle: GUIStyle;
		_helpStyle = new GUIStyle(GUI.skin.label);
		_helpStyle.fontSize = 9;		
		var _color1: Color32 = Color32(0, 255, 255, 255);
		var _color2: Color32 = Color32(200, 255, 255, 255);
		var _color4: Color32 = Color32(255, 255, 150, 255);
		var _color3: Color32 = Color32(255, 255, 0, 255);	
		GUILayout.BeginVertical(_mainBox);
		EditorGUILayout.Space();
		if (_toggleStyle) 	GUI.color = _color1;
		else 				GUI.color = _color2;
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Tile Styles", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleStyle = !_toggleStyle;
			_toggleHelpStyles = false;
		}	
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpStyles = !_toggleHelpStyles;
			_toggleStyle = true;
		}
		EditorGUILayout.EndHorizontal();	
		if (_toggleStyle) {
			EditorGUILayout.Space();
			if(_toggleHelpStyles){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Replace style of tiles and objects \nCycle trough objects in seleced style \nRotate tiles", _helpStyle);
				EditorGUILayout.EndVertical();
			}
			GUI.color = _color4;
			if (_index >= 0) {
				_index = EditorGUILayout.Popup(_index, styleNames);
				_style = styles[_index];
			}		
			GUI.color = _color3;		
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Replace All", _bigButtonStyle)) {
				ReplaceStyles("All");
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			GUI.color = _color4;
			if (GUILayout.Button("Tiles",	_mediumButtonStyle)) {
				ReplaceStyles("Tile");
			}
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Objects",	_mediumButtonStyle)) {
				ReplaceStyles("Object");
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			GUI.color = _color3;
			if (GUILayout.Button("Prev Tile", EditorStyles.miniButtonLeft)) {
				CycleGameObjects(false);
			}
			GUI.color = _color4;
			if (GUILayout.Button("Rotate", EditorStyles.miniButtonMid)) {
				RotateGameObjects();
			}
			GUI.color = _color3;
			if (GUILayout.Button("Next Tile", EditorStyles.miniButtonRight)) {
				CycleGameObjects(true);
			}
			EditorGUILayout.EndHorizontal();
		}
		EditorGUILayout.Space();
		if (_toggleMove) 	GUI.color = _color1;
		else 				GUI.color = _color2;
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Move & Duplicate", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleMove = !_toggleMove;
			_toggleHelpMove = false;
		}
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpMove = !_toggleHelpMove;
			_toggleMove = true;
		}
		EditorGUILayout.EndHorizontal();
		if (_toggleMove) {
			EditorGUILayout.Space();
			if(_toggleHelpMove){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Blue arrows moves tiles \nYellow arrows duplicates tiles", _helpStyle);
				EditorGUILayout.EndVertical();
			}
			EditorGUILayout.BeginVertical();
			GUI.color = _color2;
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("△", _miniButtonStyle)) {
				Move(Vector3(0, 0, -1), false);
			}
			GUI.color = _color1;
			if (GUILayout.Button("▲", _miniButtonStyle)) {
				Move(Vector3(0, 1, 0), false);
			}
			GUI.color = _color2;
			if (GUILayout.Button("▽", _miniButtonStyle)) {
				Move(Vector3(0, 0, 1), false);
			}
			GUILayout.FlexibleSpace();
			GUI.color = _color4;
			if (GUILayout.Button("△", _miniButtonStyle)) {
				Move(Vector3(0, 0, -1), true);
			}
			GUI.color = _color3;
			if (GUILayout.Button("▲", _miniButtonStyle)) {
				Move(Vector3(0, 1, 0), true);
			}
			GUI.color = _color4;
			if (GUILayout.Button("▽", _miniButtonStyle)) {
				Move(Vector3(0, 0, 1), true);
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			GUI.color = _color1;
			if (GUILayout.Button("◄", _miniButtonStyle)) {
				Move(Vector3(1, 0, 0), false);
			}
			if (GUILayout.Button("▼", _miniButtonStyle)) {
				Move(Vector3(0, -1, 0), false);
			}
			if (GUILayout.Button("►", _miniButtonStyle)) {
				Move(Vector3(-1, 0, 0), false);
			}
			GUILayout.FlexibleSpace();
			GUI.color = _color3;
			if (GUILayout.Button("◄", _miniButtonStyle)) {
				Move(Vector3(1, 0, 0), true);
			}
			if (GUILayout.Button("▼", _miniButtonStyle)) {
				Move(Vector3(0, -1, 0), true);
			}
			if (GUILayout.Button("►", _miniButtonStyle)) {
				Move(Vector3(-1, 0, 0), true);
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.EndVertical();
			
		}
		EditorGUILayout.Space();
		if (_toggleRemove) 	GUI.color = _color1;
		else 				GUI.color = _color2;
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Remove Hidden Sides", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleRemove = !_toggleRemove;
			_toggleHelpSides = false;
		}
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpSides = !_toggleHelpSides;
			_toggleRemove = true;
		}
		EditorGUILayout.EndHorizontal();
		if (_toggleRemove) {			
			EditorGUILayout.Space();
			if(_toggleHelpSides){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Edit meshes to remove geometry \n\nArrows manually remove side \nAuto Destroy remove blocked sides\nReset Sides revert to prefab", _helpStyle);
				EditorGUILayout.EndVertical();
			}
			EditorGUILayout.BeginVertical();
			GUI.color = _color1;
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();

			if (GUILayout.Button("△", _miniButtonStyle)) {
				removey("back");
			}
			GUI.color = _color2;
			if (GUILayout.Button("▲", _miniButtonStyle)) {
				removey("up");
			}
			GUI.color = _color1;
			if (GUILayout.Button("▽", _miniButtonStyle)) {
				removey("front");
			}
			GUILayout.FlexibleSpace();
			GUI.color = _color3;
			if (GUILayout.Button("Auto Destroy", _mediumButtonStyle)) {
				if (Selection.activeTransform.GetComponent(TileToolGroup)) {
					var glist: Transform[];
					glist = new Transform[Selection.activeTransform.childCount];
					var o: Transform = Selection.activeTransform;
					for (k = 0; k < Selection.activeTransform.childCount; k++) {
						glist[k] = o.GetChild(k);
					}
					_selection = glist;
				} else {
					_selection = Selection.transforms; //Add selection to array
				}
				Undo.RecordObjects(_selection, "TileTool: Auto Destroy Sides");
				for (var j = 0; j < _selection.Length; j++) {
					var pp: float = j;
					EditorUtility.DisplayProgressBar("TileTool: Auto Destroy Sides", "", (pp + _selection.Length) / (_selection.Length * 2));
					AutoRemoveSides(_selection[j].gameObject);
				}
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			GUI.color = _color2;
			if (GUILayout.Button("◄", _miniButtonStyle)) {
				removey("left");
			}
			if (GUILayout.Button("▼", _miniButtonStyle)) {
				removey("down");
			}
			if (GUILayout.Button("►", _miniButtonStyle)) {
				removey("right");
			}
			GUILayout.FlexibleSpace();
			GUI.color = _color4;	
			if (GUILayout.Button("Reset Sides", _mediumButtonStyle)) {
				ResetToPrefab();
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.EndVertical();
			GUI.color = Color.white;

		}
		EditorGUILayout.Space();
		if (_toggleGroup) 	GUI.color = _color1;
		else 				GUI.color = _color2;
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Grouping", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleGroup = !_toggleGroup;
			_toggleHelpGroups = false;
		}
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpGroups = !_toggleHelpGroups;
			_toggleGroup = true;
		}
		EditorGUILayout.EndHorizontal();	
		if (_toggleGroup) {
			EditorGUILayout.Space();
			if(_toggleHelpGroups){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Group selected tiles or objects", _helpStyle);
				EditorGUILayout.EndVertical();
			}		
			GUI.color = _color3;
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Group", _mediumButtonStyle)) {
				Group();
			}
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("UnGroup", _mediumButtonStyle)) {
				UnGroup();
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
		//	EditorGUILayout.LabelField("Undo not supported for grouping", EditorStyles.miniLabel);
		}
		EditorGUILayout.Space();
		if (_toggleReplace) 	GUI.color = _color1;
		else 				GUI.color = _color2;		
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Replace GameObjects", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleReplace = !_toggleReplace;
			_toggleHelpReplace = false;
		}
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpReplace = !_toggleHelpReplace;
			_toggleReplace = true;
		}
		EditorGUILayout.EndHorizontal();
		if (_toggleReplace) {
			EditorGUILayout.Space();
			if(_toggleHelpReplace){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Replace selected objects in scene\nwith prefab", _helpStyle);
				EditorGUILayout.EndVertical();
			}
			GUI.color = _color4;	
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			_replaceObject = EditorGUILayout.ObjectField(_replaceObject, GameObject, false,  GUILayout.Width(81));
			GUI.color = _color3;
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Replace", _mediumButtonStyle)) {
				if (_replaceObject) {
					ReplaceGameObjects();
				} else {
					Debug.LogError("No Prefab assigned");
				}
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
		}
		EditorGUILayout.Space();
		if (_toggleSnap) 	GUI.color = _color1;
		else 				GUI.color = _color2;		
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("Snapping", EditorStyles.toolbarButton, GUILayout.Width(180))) {
			_toggleSnap = !_toggleSnap;
			_toggleHelpSnap = false;
		}
		GUI.color = _color3;
		if (GUILayout.Button("?", EditorStyles.toolbarButton, GUILayout.Width(20))) {
			_toggleHelpSnap = !_toggleHelpSnap;
			_toggleSnap = true;
		}
		EditorGUILayout.EndHorizontal();
		if (_toggleSnap) {
			EditorGUILayout.Space();
			if(_toggleHelpSnap){
				EditorGUILayout.BeginVertical("Box");
				EditorGUILayout.TextArea("Snap gameobject position\nAutosnap only works with tiles", _helpStyle);
				EditorGUILayout.EndVertical();
			}
			GUI.color = _color4;	
			if (Selection.transforms.Length < _autoSnapMax) doSnap = EditorGUILayout.Toggle("Autosnap", doSnap);
			else doSnap = EditorGUILayout.Toggle("Autosnap (disabled)", doSnap);
			snapValue = EditorGUILayout.FloatField("Value", snapValue);
			_autoSnapMax = EditorGUILayout.IntField("Max Autosnap", _autoSnapMax);
			EditorGUILayout.Space();
			GUI.color = _color3;
			EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Snap", _bigButtonStyle)) {
				snap(false);
			}
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();		
		}
		//EditorGUILayout.LabelField("Selected Objects: " + Selection.transforms.Length, EditorStyles.miniLabel);
		GUILayout.EndVertical();
	}

	function OnInspectorUpdate() {
		Repaint();
		EditorUtility.ClearProgressBar();
		if (_index < 0) {
			this.RefreshStyles();
		}
	}
	
	function RefreshStyles() {
		Resources.LoadAll("");
		styles = new Resources.FindObjectsOfTypeAll(TileStyles);
		styleNames = new String[styles.Length];
		for (var i: int; i < styleNames.length; i++) {
			styleNames[i] = styles[i].name;
			_index = 0;
		}
	}
	
	function AutoRemoveSidesInit(gameObj: GameObject) {
		var TTT: TileToolTile = gameObj.GetComponent(TileToolTile);
		if (TTT) {
			TTT.Init();
		}
	}

	function AutoRemoveSides(gameObj: GameObject) {
		var TTT: TileToolTile = gameObj.GetComponent(TileToolTile);
		if (TTT) {
			Undo.RegisterCompleteObjectUndo(gameObj, "TileTool: Auto Remove Side");
			TTT.DetectTiles();
		}
	}

	function ManualRemoveSide(t: Transform, side: String) {
		var TTT: TileToolTile = t.GetComponent(TileToolTile);
		if (TTT) {
			Undo.RegisterCompleteObjectUndo(t.gameObject, "TileTool: Manual Remove Side "+side);
			TTT.RemoveSide(t.FindChild("Model").GetComponent(MeshFilter), side, BlackBerryBuildType.gameObject);
		}
	}

	function SetActiveColliders(go: GameObject, a: boolean) {
		var colliders: Component[];
		colliders = go.GetComponentsInChildren(Collider);
		for (var collider: Collider in colliders) {
			collider.enabled = a;
		}
	}

	function CombineVector3Arrays(array1: GameObject[], array2: GameObject[]): GameObject[] {
		var array3 = new GameObject[array1.length + array2.length];
		System.Array.Copy(array1, array3, array1.length);
		System.Array.Copy(array2, 0, array3, array1.length, array2.length);
		return array3;
	}

	function ReplaceStyles(type: String) {
		if (Selection.transforms.Length > 0 && _style) { //Check if style is assigned
			var styleObjects: GameObject[];
			if (type == "Tile") styleObjects = _style._tiles; //CombineVector3Arrays(_style._tiles, _style._objects);
			else if (type == "Object") styleObjects = _style._objects;
			else if (type == "All") styleObjects = CombineVector3Arrays(_style._tiles, _style._objects);
			if (Selection.activeTransform.GetComponent(TileToolGroup)) {
				var glist: Transform[];
				glist = new Transform[Selection.activeTransform.childCount];
				var o: Transform = Selection.activeTransform;
				for (i = 0; i < Selection.activeTransform.childCount; i++) {
					glist[i] = o.GetChild(i);
				}
				_selection = glist;
			} else {
				_selection = Selection.transforms; //Add selection to array
			}
			//     var olist:GameObject[];
			//   olist = new GameObject[_selection.length];
			for (i = 0; i < _selection.Length; i++) {
				var p: float = i;
				EditorUtility.DisplayProgressBar("TileTool: Replacing GameObjects", "Any removed sides will be reset", p / _selection.Length);
				//olist[i] = _selection[i].gameObject;
				var TTO: TileToolStyle = _selection[i].GetComponent(TileToolStyle);
				if (TTO && TTO.objectName != "") {
					s = TTO.objectName;
					for (var j: int = 0; j < styleObjects.Length; j++) {
						var newTTO: TileToolStyle = styleObjects[j].GetComponent(TileToolStyle);
						if (newTTO) {
							var newObjectTile: String = newTTO.objectName;
							if (s == newObjectTile) {
								var newObject: GameObject;
								newObject = PrefabUtility.InstantiatePrefab(styleObjects[j]);
								var newT: Transform = newObject.transform;
								newT.position = _selection[i].position;
								newT.rotation = _selection[i].rotation;
								newT.localScale = _selection[i].localScale;
								//              olist[i] = newObject;
								newT.parent = _selection[i].transform.parent;
								Undo.RegisterCreatedObjectUndo(newObject, "TileTool: Replace Styles");
								Undo.DestroyObjectImmediate(_selection[i].gameObject);
								break;
							}
						}
					}
				}
			}
			//if(!Selection.activeTransform.GetComponent(TileToolGroup)){
			//      	Selection.objects = olist;
			//}
		}
	}

	function ReplaceGameObjects() {
		_selection = Selection.transforms;
		for (i = 0; i < _selection.Length; i++) {
			var newObject: GameObject = PrefabUtility.InstantiatePrefab(_replaceObject);
			var newT: Transform = newObject.transform;
			newT.position = _selection[i].position;
			newT.rotation = _selection[i].rotation;
			newT.localScale = _selection[i].localScale;
			newT.parent = _selection[i].transform.parent;
			Undo.RegisterCreatedObjectUndo(newObject, "TileTool: Replace Styles");
			Undo.DestroyObjectImmediate(_selection[i].gameObject);
		}
	}

	function RotateGameObjects() {
		_selection = Selection.transforms;
		Undo.RecordObjects(_selection, "TileTool: Rotate");
		for (i = 0; i < _selection.Length; i++) {
			_selection[i].Rotate(_selection[i].transform.up * 90);
		}
	}

	function CycleGameObjects(next: boolean) {
		if (_style) {
			_selection = Selection.transforms;
			if (next) this._tileCycleCounter++;
			else this._tileCycleCounter--;
			if (_tileCycleCounter >= _style._tiles.length) _tileCycleCounter = 0;
			else if (_tileCycleCounter < 0) _tileCycleCounter = _style._tiles.length - 1;
			var s: GameObject[];
			s = new GameObject[_selection.length];
			for (i = 0; i < _selection.Length; i++) {
				var TTT: TileToolTile = _selection[i].GetComponent(TileToolTile);
				if (TTT) {
					var newObject: GameObject = PrefabUtility.InstantiatePrefab(_style._tiles[_tileCycleCounter]);
					var newT: Transform = newObject.transform;
					newT.position = _selection[i].position;
					newT.rotation = _selection[i].rotation;
					newT.localScale = _selection[i].localScale;
					newT.parent = _selection[i].transform.parent;
					Undo.RegisterCreatedObjectUndo(newObject, "TileTool: Cycle Tiles");
					Undo.DestroyObjectImmediate(_selection[i].gameObject);
					s[i] = newObject;
				}
			}
			Selection.objects = s;
		} else {
			Debug.Log("No Style");
		}
	}

	function Update() {
		if (Selection.transforms.Length < _autoSnapMax && Selection.transforms.Length > 0 && !EditorApplication.isPlaying && doSnap && Selection.transforms[0].position != prevPosition) snap(true);
	}

	function snap(onlyTiles: boolean) {
		_selection = Selection.transforms;
		try {
			for (i = 0; i < Selection.transforms.Length; i++) {
				var TTT: TileToolTile = _selection[i].GetComponent(TileToolTile);
				if (onlyTiles && TTT || !onlyTiles) {
					if (!onlyTiles) {
						Undo.RecordObjects(_selection, "TileTool: Snapping");
					}
					var t: Vector3 = Selection.transforms[i].transform.position;
					t.x = round(t.x);
					t.y = round(t.y);
					t.z = round(t.z);
					Selection.transforms[i].transform.position = t;
				}
			}
			prevPosition = Selection.transforms[0].position;
		} catch (e) {
			Debug.LogError("Nothing to move.  " + e);
		}
	}

	function round(input: float) {
		var snappedValue: float;
		snappedValue = snapValue * Mathf.Round((input / snapValue));
		return (snappedValue);
	}

	function Group() {
		_selection = Selection.transforms;
		var sl: int = _selection.Length;
		if (_selection.Length > 0) {
			var newGo: GameObject = new GameObject();
			newGo.name = "_TileTool Group";
			newGo.AddComponent(TileToolGroup);
			for (i = 0; i < _selection.Length; i++) {
				var p: float = i;
				EditorUtility.DisplayProgressBar("TileTool: Grouping" + p + "/" + sl, "", p / sl);
				if (!_selection[i].transform.parent || _selection[i].transform.parent.GetComponent(TileToolGroup)) {
					_selection[i].gameObject.transform.parent = newGo.transform;
				}
			}
			if (newGo.transform.childCount == 0) {
				DestroyImmediate(newGo);
				Debug.LogWarning("Group Failed: Objects already grouped");
			}
		}
	}

	function UnGroup() {
		_selection = Selection.transforms;
		var sl: int = _selection.Length;
		if (_selection.Length > 0) {
			for (i = 0; i < _selection.Length; i++) {
				if (_selection[i].transform.parent && _selection[i].transform.parent.GetComponent(TileToolGroup)) {
					var p: float = i;
					EditorUtility.DisplayProgressBar("TileTool: UnGrouping " + p + "/" + sl, "", p / sl);
					_selection[i].gameObject.transform.parent = null;
				}
			}
		}
	}

	function ResetToPrefab() {
		if (Selection.activeTransform.GetComponent(TileToolGroup)) {
			var glist: Transform[];
			glist = new Transform[Selection.activeTransform.childCount];
			var o: Transform = Selection.activeTransform;
			for (k = 0; k < Selection.activeTransform.childCount; k++) {
				glist[k] = o.GetChild(k);
			}
			_selection = glist;
		} else {
			_selection = Selection.transforms; //Add selection to array
		}
		Undo.RecordObjects(_selection, "TileTool: Reset To Prefab");
		var sl: int = _selection.Length;
		if (_selection.Length > 0) {
			for (i = 0; i < _selection.Length; i++) {
				var p: float = i;
				EditorUtility.DisplayProgressBar("TileTool: Tile Reset", "", p / sl);
				var TTT: TileToolTile = _selection[i].GetComponent(TileToolTile);
				if (TTT) {
					Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "TileTool: Prefab Reset");
					var scale: Vector3 = _selection[i].localScale;
					PrefabUtility.RevertPrefabInstance(_selection[i].gameObject);
					_selection[i].localScale = scale;
				}
			}
		}
	}

	function removey(side: String) {
		if (Selection.activeTransform.GetComponent(TileToolGroup)) {
			var glist: Transform[];
			glist = new Transform[Selection.activeTransform.childCount];
			var o: Transform = Selection.activeTransform;
			for (k = 0; k < Selection.activeTransform.childCount; k++) {
				glist[k] = o.GetChild(k);
			}
			_selection = glist;
		} else {
			_selection = Selection.transforms; //Add selection to array
		}
		for (i = 0; i < _selection.Length; i++) {
			var p: float = i;
			EditorUtility.DisplayProgressBar("TileTool: Removing Sides", "", p / _selection.Length);
			ManualRemoveSide(_selection[i].transform, side);
		}
	}
	
	function Move(dir: Vector3, dupe: boolean) {	
		if(Selection.transforms.length > 0){
			var TTG:TileToolGroup = Selection.activeTransform.GetComponent(TileToolGroup);
			if (TTG) {
				var glist: Transform[];
				glist = new Transform[Selection.activeTransform.childCount];
				var o: Transform = Selection.activeTransform;
				for (k = 0; k < Selection.activeTransform.childCount; k++) {
					glist[k] = o.GetChild(k);
				}
				_selection = glist;
			} else {
				_selection = Selection.transforms;
			}
			var newSelection:GameObject[] = new GameObject[_selection.Length];
			for (i = 0; i < _selection.Length; i++) {
				var TTT: TileToolTile = _selection[i].GetComponent(TileToolTile);			
				if (TTT) {	
					if (dupe) {
						var dupePrefab = PrefabUtility.GetPrefabParent(_selection[i]);
						var dupeTarget = PrefabUtility.InstantiatePrefab(dupePrefab);
						dupeTarget.transform.position = _selection[i].transform.position + dir;
						dupeTarget.transform.rotation = _selection[i].transform.rotation;
						dupeTarget.transform.parent = _selection[i].transform.parent;
						newSelection[i] = dupeTarget.gameObject;
						Undo.RegisterCreatedObjectUndo(dupeTarget.gameObject, "TileTool: Move & Duplicate");
					}else{
						Undo.RegisterCompleteObjectUndo(_selection[i].gameObject, "TileTool: Move & Duplicate");
						_selection[i].transform.position += dir;
					}
				}
			}
			if(dupe)
				Selection.objects = newSelection;	
		}
	}
}