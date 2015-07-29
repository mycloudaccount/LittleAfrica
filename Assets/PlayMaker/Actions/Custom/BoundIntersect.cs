// (c) Copyright HutongGames, LLC 2010-2013. All rights reserved.

using System;
using UnityEngine;
using System.Collections;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Animation)]
	[Tooltip("Takes 2 game objects and figures out whether or not thier bounds are intersecting.  Both game objects must have an associated collider component.")]
	public class BoundIntersection : FsmStateAction
	{
		[RequiredField]
		[CheckForComponent(typeof(Collider))]
		[Tooltip("Game Object to check for intersections.")]
		public FsmOwnerDefault defaultGameObject;
		
		[RequiredField]
		[CheckForComponent(typeof(Collider))]
		[Tooltip("Game Object to check for intersections.")]
		public FsmOwnerDefault intersectingGameObject;

		[Tooltip("Event to send when collider bounds are found to be intersecting.")]
		public FsmEvent intersectingEvent;
		
		[Tooltip("Event to send when collider bounds are not found to be intersecting.")]
		public FsmEvent notIntersectingEvent;

		// buffer used to determine if the colliders are close enough to eachother to be considered in contact.
		[Tooltip("Buffer used to determine if the colliders are close enough to eachother to be considered in contact.")]
		public Vector3 contactBuffer = new Vector3 (0.0f, 0.0f, 0.0f);


		public override void Reset()
		{
			defaultGameObject = null;
			intersectingGameObject = null;
			intersectingEvent = null;
			notIntersectingEvent = null;
			contactBuffer = new Vector3 (0.0f, 0.0f, 0.0f);
		}
		
		public override void OnEnter()
		{
			DoDetermineIntersection();
		}
		
		void DoDetermineIntersection()
		{

			Bounds gameObjColliderBounds = new Bounds ();
			Bounds intersectingObjColliderBounds = new Bounds ();

			GameObject gameObj = Fsm.GetOwnerDefaultTarget(defaultGameObject);
			if (gameObj == null) {
				LogWarning ("Missing default game Object for this action!");
				Finish ();
				return;
			} else {

				// get collider bound for game object
				Collider collider = gameObj.GetComponent<Collider>();
				
				if (collider != null) {
					gameObjColliderBounds = collider.bounds;
					gameObjColliderBounds.Expand(contactBuffer);
				} else {
					LogWarning("Default game Object must have an associated collider!");
					Finish();
					return;
				}

			}

			GameObject intersectingGameObj = Fsm.GetOwnerDefaultTarget(intersectingGameObject);
			if (intersectingGameObj == null)
			{
				LogWarning("Missing intersecting game Object for this action!");
				Finish();
				return;
			} else {
				
				// get collider bound for game object
				Collider collider = intersectingGameObj.GetComponent<Collider>();

				if (collider != null) {
					intersectingObjColliderBounds = collider.bounds;
					intersectingObjColliderBounds.Expand(contactBuffer);
				} else {
					LogWarning("Intersecting game Object must have an associated collider!");
					Finish();
					return;
				}

			}

			if (gameObjColliderBounds.Intersects (intersectingObjColliderBounds)) {
				Debug.Log ("myibmaccount - INTERSECTING!!!!");
				Fsm.Event (intersectingEvent);
			} else {
				Debug.Log ("myibmaccount - NOT INTERSECTING!!!!");
				Fsm.Event (notIntersectingEvent);
			}

		}
		
		public override void OnUpdate()
		{
		}
		
		public override void OnExit()
		{
		}
		

	}
}

