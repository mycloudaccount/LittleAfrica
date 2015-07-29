@CustomEditor(TileToolTile)
public class TileToolTileEditor extends Editor {	
	var tex: Texture = Resources.Load("TT_SideHelp");
	function OnEnable(){	
		target.FindAndSetTileValues();
		var TTS:TileToolStyle = target.gameObject.GetComponent(TileToolStyle);
		if(!TTS){
			target.gameObject.AddComponent(TileToolStyle);
		}
		if (GUI.changed){
			EditorUtility.SetDirty(target);
		}
	}					
    override function OnInspectorGUI () {
    	DrawDefaultInspector();	
		var titleStyle = new GUIStyle(GUI.skin.label);
		GUILayout.Label(tex, titleStyle);
	}	
}