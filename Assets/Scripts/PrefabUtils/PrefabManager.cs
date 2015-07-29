using UnityEngine;
using System.Collections;

public class PrefabManager : MonoBehaviour {

	private GameObject gameObj = null;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void setGameObject(GameObject go) {
	
		gameObj = go;
	
	}

	public void hideChild(string childObjectName) {
		
		GameObject childObject;
		Component[] renderers;

		//Finds child of current object.
		if (gameObj != null) {
			childObject = gameObj.transform.Find(childObjectName).gameObject;
		} else {
			childObject = transform.Find(childObjectName).gameObject;
		}

		if (childObject != null) {
			
			renderers = childObject.GetComponentsInChildren<Renderer>();
			
			foreach (Renderer r in renderers) {
				r.enabled = false;
			}
			
		}
		
	}
	
	public void showChild(string childObjectName) {
		
		GameObject childObject;
		Component[] renderers;

		//Finds and child of current object by name.
		if (gameObj != null) {
			childObject = gameObj.transform.Find(childObjectName).gameObject;
		} else {
			childObject = transform.Find(childObjectName).gameObject;
		}

		if (childObject != null) {
			
			renderers = childObject.GetComponentsInChildren<Renderer> ();
			
			foreach (Renderer r in renderers) {
				r.enabled = true;
			}
			
		}
		
	}	

	public void showSibling(string siblingObjectName) {
		
		GameObject siblingObject;
		GameObject parentObject;
		Component[] renderers;
		
		if (gameObj != null) {
			parentObject = gameObj.transform.parent.gameObject;
		} else {
			parentObject = transform.parent.gameObject;
		}

		if (parentObject != null) {
			
			siblingObject = parentObject.transform.Find (siblingObjectName).gameObject;
			
			if (siblingObject != null) {
				
				renderers = siblingObject.GetComponentsInChildren<Renderer> ();
				
				foreach (Renderer r in renderers) {
					r.enabled = true;
				}
				
			}
			
		}
		
	}

	public void hideSibling(string siblingObjectName) {
		
		GameObject siblingObject;
		GameObject parentObject;
		Component[] renderers;
		
		if (gameObj != null) {
			parentObject = gameObj.transform.parent.gameObject;
		} else {
			parentObject = transform.parent.gameObject;
		}

		if (parentObject != null) {
			
			siblingObject = parentObject.transform.Find(siblingObjectName).gameObject;
			
			if (siblingObject != null) {
				
				renderers = siblingObject.GetComponentsInChildren<Renderer> ();
				
				foreach (Renderer r in renderers) {
					r.enabled = false;
				}
				
			}
			
		}
		
	}	

}
