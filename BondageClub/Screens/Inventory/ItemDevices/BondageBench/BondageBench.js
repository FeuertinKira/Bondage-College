"use strict";
var InventoryItemDevicesBondageBenchMessage = "";

// Loads the item extension properties
function InventoryItemDevicesBondageBenchLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemDevicesBondageBenchDraw() {
	
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	DrawText(DialogFind(Player, "BondageBenchSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", (InventoryGet(C, "ItemMisc") == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/StrapUp.png", 1500, 550);
	DrawText(DialogFind(Player, "BondageBenchPoseStrapUp"), 1375, 800, "white", "gray");

	// Draw the message if present
	if (InventoryItemDevicesBondageBenchMessage != null) DrawTextWrap(DialogFind(Player, InventoryItemDevicesBondageBenchMessage), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemDevicesBondageBenchClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CommonIsClickAt(1500, 550, 225, 225) && InventoryGet(C, "ItemMisc") == null) InventoryItemDevicesBondageBenchSetPose("StrapUp");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemDevicesBondageBenchSetPose(NewPose) {
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemDevicesBondageBenchLoad();
	}

	if (InventoryGet(C, "Cloth") != null || InventoryGet(C, "ClothLower") != null) {
		InventoryItemDevicesBondageBenchMessage = "RemoveClothesForItem";
		return;
	}

	if(InventoryGet(C, "ItemMisc") != null){
		//InventoryItemDevicesBondageBenchMessage = "ALREADY_OCCUPIED";
		return;
	}

	if (NewPose == "StrapUp") {
		InventoryWear(C, "BondageBenchStraps", "ItemMisc");

		// Switch to the straps item
		DialogFocusItem = InventoryGet(C, "ItemMisc");
	}
	
//	// Adds the lock effect back if it was padlocked
//	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
//		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
//		DialogFocusItem.Property.Effect.push("Lock");
//	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "BondageBenchRestrain" + ((NewPose == null) ? "None" : NewPose));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}