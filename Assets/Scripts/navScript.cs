using UnityEngine;
using System.Collections;

public class navScript : MonoBehaviour {

	public GameObject target;
	public RaycastHit hit;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

	
	}

	// update the target.  
	//
	// 	- if the target is null, then do nothing
	//	
	//	- once we reach the target set target to null
	void updateMoveToTarget(GameObject trgt) {
	
		Debug.Log ("Selected Object is: " + trgt);
		if (trgt != null) {
			// if not null move to target
			gameObject.GetComponent<NavMeshAgent> ().SetDestination (trgt.transform.position);
		} else {
			// if null stay put
			gameObject.GetComponent<NavMeshAgent> ().SetDestination (gameObject.transform.position);
		}


	}


}
