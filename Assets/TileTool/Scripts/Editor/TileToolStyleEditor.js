@CustomEditor(TileToolStyle)
@CanEditMultipleObjects
public class TileToolStyleEditor extends Editor {
	function OnEnable(){	
		FindAndSetTileValues();
		if (GUI.changed){
			EditorUtility.SetDirty(target);
		}
	}	
    override function OnInspectorGUI () {
    	DrawDefaultInspector();
	}
	function FindAndSetTileValues(){
	// Fills in values that are missing, only happens in editor
		if(target.style == "" || target.objectName == ""){
			var words = target.gameObject.name.Split("_" [0]);
			target.style = words[0];
			target.objectName = target.gameObject.name.Replace(target.style, "");
		}
	}
}