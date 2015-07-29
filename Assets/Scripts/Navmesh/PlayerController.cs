/*  This file is part of the "NavMesh Extension" project by Rebound Games.
 *  You are only allowed to use these resources if you've bought them directly or indirectly
 *  from Rebound Games. You shall not license, sublicense, sell, resell, transfer, assign,
 *  distribute or otherwise make available to any third party the Service or the Content. 
 */

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using NavMeshExtension;

/// <summary>
/// Example integration of NavMesh Agents with portal behavior.
/// <summary>
[RequireComponent(typeof(NavMeshAgent))]
public class PlayerController : MonoBehaviour
{

    /// <summary>
    /// Target destination object, set by mouse input.
    /// <summary>
    public GameObject pointer;

	public bool renderPointer = true;

    //reference to pointer object
	private static GameObject pointerObj;
	//reference to agent
    private NavMeshAgent agent;
    //resulting path from the PortalManager call
    private Vector3[] path;

	// used to comunicate with player FSM
	private PlayMakerFSM mainFsm;

	// buffer between selected above and the player (should be set 0 when selecting random position)
	private float selectObjectBuffer = 0.0f;

    //get components
    void Start()
    {
        if(!pointerObj) 
            pointerObj = (GameObject)Instantiate(pointer, transform.position, Quaternion.identity);

		Component[] renderers;
		renderers = pointerObj.GetComponentsInChildren<Renderer> ();
		if (!renderPointer) {
			foreach (Renderer r in renderers) {
				r.enabled = false;
			}
		}
        
        agent = GetComponent<NavMeshAgent>();
    }

	void Awake() {

		PlayMakerFSM[] temp = GetComponents<PlayMakerFSM>();
		foreach (PlayMakerFSM fsm in temp) {
			if (fsm.FsmName == "AmaFSM"){
				mainFsm = fsm;
				break;
			}
		}	
	
	}

    //check for mouse input
    void Update()
    {

        //on left mouse button down
        if (Input.GetMouseButtonDown(0))
        {


			RaycastHit hit;
			Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			
			//the mouse ray has hit a collider in the scene
			if (Physics.Raycast(ray, out hit))
			{

				GameObject selectedObject;
				
				// TODO: before we we walk to player selected location lets make sure
				// player has not selected a specific selectable object
				selectedObject = mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value;
				Debug.Log("hit collider with tag: " + hit.collider.tag);
				
				if (hit.collider.tag == "selectable") {
					
					// check to see if this object is in selected state
					PlayMakerFSM selectedObjectFSM = selectedObject.GetComponent<PlayMakerFSM>();
					bool selected = selectedObjectFSM.FsmVariables.GetFsmBool ("isSelected").Value;
					Debug.Log ( "Object Selection is Set to: " +  selected);
					
					if (selected) {
						selectObjectBuffer = 1.8f;
						moveToSelectedObject(selectedObject);
					}

				} else {

					try {
						if (selectedObject != null) {
							// dont render arrow
							PrefabManager pm = selectedObject.GetComponent<PrefabManager>();
							pm.hideSibling("selectionArrow");
							
							PlayMakerFSM selectedObjectFSM = selectedObject.GetComponent<PlayMakerFSM>();
							selectedObjectFSM.FsmVariables.GetFsmBool ("isSelected").Value = false;
							// set the globally selected object to null
							mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value = null;
						}
					} 
					catch(MissingReferenceException mre) {
					}

					selectObjectBuffer = 0.0f;
					moveToPoint();

				}

			}


        }

    }

	void stopMovement() {

		GameObject selectedObject = mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value;
		if (selectedObject != null) {
			PlayMakerFSM selectedObjectFSM = selectedObject.GetComponent<PlayMakerFSM>();
			selectedObjectFSM.FsmVariables.GetFsmBool ("isSelected").Value = false;
			// set the globally selected object to null
			mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value = null;
		}

		//stop existing movement routines
		mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value = false;
		StopAllCoroutines();
		agent.Stop();
			
	}

	void moveToSelectedObject(GameObject trgt) {
		
		//construct path:
		//starting at the current gameobject position
		//ending at the position of the pointer object
		path = PortalManager.GetPath(transform.position, trgt.transform.position);
		
		//stop existing movement routines
		StopAllCoroutines();
		
		// TODO: set FSM motion variable to true 
		mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value = true;
		
		//start new agent movement to the destination
		StartCoroutine(GoToDestination());

	}
	
	// move to player selected location
	void moveToPoint() {

		RaycastHit hit;
		Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		//the mouse ray has hit a collider in the scene
		if (Physics.Raycast (ray, out hit)) {

			//reposition pointer object to the hit point
			pointerObj.transform.position = hit.point;
			
			//construct path:
			//starting at the current gameobject position
			//ending at the position of the pointer object
			path = PortalManager.GetPath (transform.position, pointerObj.transform.position);
			
			//stop existing movement routines
			StopAllCoroutines ();
			
			// TODO: set FSM motion variable to true 
			mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value = true;
			Debug.Log (mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value);

			//start new agent movement to the destination
			StartCoroutine (GoToDestination ());

		}

	}
	
	//loops over path positions, sets the 
	//current target destination of this agent
	IEnumerator GoToDestination()
	{
		//path index
		int i = 0;

		//iterate over all positions
        while(i < path.Length)
        {
            //teleport to the current position
            agent.Warp(path[i]);
            i++;

            //walk to the next position
            agent.SetDestination(path[i]);
			yield return new WaitForEndOfFrame();
			
            while (agent.pathPending)
                yield return null;

            //wait until we reached this position
            float remain = agent.remainingDistance;
            while (remain == Mathf.Infinity || (remain - agent.stoppingDistance - selectObjectBuffer) > float.Epsilon
            || agent.pathStatus != NavMeshPathStatus.PathComplete)
            {
                remain = agent.remainingDistance;
                yield return null;
            }

            //increase counter
            i++;
        }

		// we made it to the object:
		// - make sure no objects in our scene are selected
		GameObject selectedObject = mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value;
		if (selectedObject != null) {
			// dont render arrow
			PrefabManager pm = selectedObject.GetComponent<PrefabManager>();
			pm.hideSibling("selectionArrow");

			PlayMakerFSM selectedObjectFSM = selectedObject.GetComponent<PlayMakerFSM>();
			selectedObjectFSM.FsmVariables.GetFsmBool ("isSelected").Value = false;
			// set the globally selected object to null
			mainFsm.FsmVariables.GetFsmGameObject ("SelectedObject").Value = null;
		}

		// TODO: set FSM motion variable to false
		mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value = false;
		Debug.Log (mainFsm.FsmVariables.GetFsmBool ("MovingToTarget").Value);
		//agent reached the final destination
        agent.Stop();
    }


}
