@CustomEditor(TileStyles)
public class TileStylesEditor extends Editor {
    override function OnInspectorGUI () {
    	DrawDefaultInspector();
		GUILayout.Label("To drag multiple prefabs to an array:\nLock the inspector by clicking the lock icon\nin the top right corner of the inspector", EditorStyles.miniBoldLabel);
	}
}	