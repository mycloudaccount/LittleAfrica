// (c) Copyright HutongGames, LLC 2010-2013. All rights reserved.

using System;
using UnityEngine;
using System.Collections;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Animation)]
	[Tooltip("Takes game object and stores its sibling in specified parameter.")]
	public class GetSibling : FsmStateAction
	{
		[RequiredField]
		[Tooltip("Game Object to with sibling.")]
		public FsmOwnerDefault defaultGameObject;
		
		[RequiredField]
		[Tooltip("Sibling Name.")]
		public String siblingName;

		[RequiredField]
		[Tooltip("Game Object to Store the found Sibling in.")]
		public FsmGameObject storeResult;
		
		public override void Reset()
		{
			defaultGameObject = null;
			siblingName = "";
			storeResult = null;
		}
		
		public override void OnEnter()
		{
			DoDetermineSibling();
		}
		
		void DoDetermineSibling()
		{

			GameObject gameObj = Fsm.GetOwnerDefaultTarget(defaultGameObject);
			if (gameObj == null) {
				LogWarning ("Missing default game Object for this action!");
				Finish ();
				return;
			}			
			else if (siblingName == null)
			{
				LogWarning("Missing sibling object name!");
				Finish();
				return;
			}

			// let's get sibling
			storeResult.Value = getSibling (gameObj, siblingName);

			if (storeResult.Value == null) {
				LogWarning ("Could not find sibling object!");
				Finish ();
				return;
			}

			Finish ();
			return;

		}

		public GameObject getSibling(GameObject gameObj, string siblingObjectName) {
			
			GameObject siblingObj;
			GameObject parentObject;

			parentObject = gameObj.transform.parent.gameObject;

			if (parentObject != null) {
				
				siblingObj = parentObject.transform.Find (siblingObjectName).gameObject;
				
				if (siblingObj != null) {

					return siblingObj;

				} 
				
			}

			return null;
			
		}

		public override void OnUpdate()
		{
		}
		
		public override void OnExit()
		{
		}
		

	}
}

