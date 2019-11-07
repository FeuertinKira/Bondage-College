"use strict";
var InventoryItemMiscBondageBenchStrapsMessage = "";

// Loads the item extension properties
function InventoryItemMiscBondageBenchStrapsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemMiscBondageBenchStrapsDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "BondageBenchStrapsSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Light.png", 1000, 550);
	DrawText(DialogFind(Player, "BondageBenchStrapsPoseLight"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Normal")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Normal.png", 1250, 550);
	DrawText(DialogFind(Player, "BondageBenchStrapsPoseNormal"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Heavy")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Heavy.png", 1500, 550);
	DrawText(DialogFind(Player, "BondageBenchStrapsPoseHeavy"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Full")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1750, 550);
	DrawText(DialogFind(Player, "BondageBenchStrapsPoseFull"), 1875, 800, "white", "gray");

	// Draw the message if present
	if (InventoryItemMiscBondageBenchStrapsMessage != null) DrawTextWrap(DialogFind(Player, InventoryItemMiscBondageBenchStrapsMessage), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemMiscBondageBenchStrapsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if (CommonIsClickAt(1000, 550, 225, 225) && (DialogFocusItem.Property.Restrain != null)) InventoryItemMiscBondageBenchStrapsSetPose(null);
	if (CommonIsClickAt(1250, 550, 225, 225) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Normal"))) InventoryItemMiscBondageBenchStrapsSetPose("Normal");
	if (CommonIsClickAt(1500, 550, 225, 225) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Heavy"))) InventoryItemMiscBondageBenchStrapsSetPose("Heavy");
	if (CommonIsClickAt(1750, 550, 225, 225) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Full"))) InventoryItemMiscBondageBenchStrapsSetPose("Full");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemMiscBondageBenchStrapsSetPose(NewPose) {
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMiscBondageBenchStrapsLoad();
	}

	if (InventoryGet(C, "Cloth") == null || InventoryGet(C, "ClothLower") == null) {
		InventoryItemMiscBondageBenchStrapsMessage = "RemoveClothesForItem";
		return;
	}
	
	if (NewPose == null) {
		delete DialogFocusItem.Property.Difficulty;
		delete DialogFocusItem.Property.Type;
	} else {
		DialogFocusItem.Property.SetPose = ["LegsClosed"];
		DialogFocusItem.Property.Type = NewPose;
		if (NewPose == "Normal") DialogFocusItem.Property.Difficulty = 3;
		if (NewPose == "Heavy") DialogFocusItem.Property.Difficulty = 6;
		if (NewPose == "Full") DialogFocusItem.Property.Difficulty = 9;
	}
	DialogFocusItem.Property.Restrain = NewPose;

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "BondageBenchStrapsRestrain" + ((NewPose == null) ? "None" : NewPose));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}