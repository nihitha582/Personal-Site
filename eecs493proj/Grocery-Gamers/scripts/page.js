// Size Constants
let person_speed = 10;
const SHELF_COUNT = 89;
const OBJECT_REFRESH_RATE = 50; //ms

// Size vars
let maxPersonPosX, maxPersonPosY;

// Global Object Handles
let player;
let mute = false;
let backgroundMusic = false;
let soundEffectMusic = false;
let paused = false;
let currentDifficulty = "easy";
let changedDifficulty = false;

// Global Window Handles (gwh__)
let gwhGame, gwhStatus, gwhScore;

// Game Variables
let health = 100;
let score = 0;
let potentialScore = 0;
let numItemsCollected = 0;
let gameOver = false;

let haveImmunity = false;

let itemCount = 0; // number of grocery items - used in looping for nearItems
let nearItemExists = false;
let nearItem;
let shelfPerItem = 4;
let pointsPerItem = 10;

let groceryItems = {
	items: [
		{
			name: "apple",
			src: "img/apple.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "banana",
			src: "img/banana.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "bell_pepper",
			src: "img/bell_pepper.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "broccoli",
			src: "img/broccoli.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "candy",
			src: "img/candy.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "cheese",
			src: "img/cheese.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "chocolate",
			src: "img/chocolate.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "cookie",
			src: "img/cookie.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "corn",
			src: "img/corn.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "cupcake",
			src: "img/cupcake.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "donut",
			src: "img/donut.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "grapes",
			src: "img/grapes.png", // src: https://www.pinterest.com/pin/181832903677163745/
		},
		{
			name: "ice_cream",
			src: "img/ice_cream.png", // src: https://www.pinterest.com/pin/181832903677163745/
		},
		{
			name: "milk",
			src: "img/milk.png", // src: https://www.pinterest.com/pin/181832903677163745/
		},
		{
			name: "onion",
			src: "img/onion.png", // src: https://www.pinterest.com/pin/181832903677163745/
		},
		{
			name: "orange",
			src: "img/orange.png", // src: https://publicdomainvectors.org/en/public-domain/
		},
		{
			name: "pineapple",
			src: "img/pineapple.png", // src: http://clipart-library.com/pineapple-clipart.html
		},
		{
			name: "pizza",
			src: "img/pizza.png", // src: http://clipart-library.com/pineapple-clipart.html
		},
		{
			name: "popsicle",
			src: "img/popsicle.png", // src: http://clipart-library.com/pineapple-clipart.html
		},
		{
			name: "strawberry",
			src: "img/strawberry.png", // src: https://i.pinimg.com/originals/6e/ec/67/6eec67a48e705436c62544fb8e2baf6b.png
		},
		{
			name: "waffle",
			src: "img/waffle.png", // src: https://i.pinimg.com/originals/6e/ec/67/6eec67a48e705436c62544fb8e2baf6b.png
		},
	],
	shelfIndices: [
		49,
		50,
		51,
		52,
		53,
		54,
		55,
		56,
		57,
		58,
		59,
		60,
		61,
		62,
		63,
		64,
		65,
		66,
		67,
		68,
		69,
		70,
		71,
		76,
		77,
		78,
		79,
		80,
		81,
		82,
		83,
		84,
		85,
		86,
		87,
		88,
	],
};

let shoppingListLength = 5;

let deletedGermIndex = 0;
let germIndex = 1;
let sickPersonIndex = 1;
let fauciIndex = 1;
let powerupIndex = 1;
let factIndex = 1;

const KEYS = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	shift: 16,
	spacebar: 32,
};

let createGermItemIntervalHandle;
let createSickPersonIntervalHandle;
let createFauciIntervalHandle;
let createObstacleCollisionHandle;
let currGermFrequency = 1000;
let currSickPersonFrequency = 2000;
let fauciFrequency = 10000;

// Main
$(document).ready(function () {
	$("#splash-screen").show();
	$("#gameBackground").show();
	$("#gameControls").hide();
	$("#earningPoints").hide();
	$("#powerUps").hide();
	$("#gamePandemicGuidelines").hide();

	$("#pause-screen").hide();
	$("#end-game").hide();
	$("#game-screen").hide();
	$("#side-panel").hide();
	$("#hud-panel").hide();

	document.getElementById("bkgMusic").checked = false;
	document.getElementById("soundEffects").checked = false;
	document.getElementById("allAudio").checked = false;
});

////////////////////////// CHECKING OUT //////////////////////////

function inCheckOutPosition() {
	let checkout = $("#checkout-0");
	let below = false;
	let middleX = false;

	let belowCheck =
		player.offset().top - (checkout.offset().top + checkout.height());
	//console.log("Checkout Below Check: " + belowCheck);
	if (belowCheck <= 10 && belowCheck >= -5) {
		//console.log("Below Checkout Check Hit");
		below = true;
	}

	if (
		player.offset().left >= checkout.offset().left &&
		checkout.offset().left + checkout.width() >=
			player.offset().left + player.width()
	) {
		//console.log("Middle X Item Check Hit");
		middleX = true;
	}

	if (below && middleX) {
		return true;
	} else {
		return false;
	}
}

function checkForCheckingOut() {
	if (inCheckOutPosition()) {
		console.log("Ready to Checkout Items");

		// Add potential score to real score
		let scoreChange = potentialScore;
		potentialScore = 0;
		setScore(scoreChange);

		let allItemsCollected = true;

		// Check if all shopping list items are collected
		for (let i = 0; i < shoppingListLength; ++i) {
			let shoppingListItem = $("#list_item-" + i.toString());

			if (!shoppingListItem.hasClass("collected")) {
				allItemsCollected = false;
				break;
			}
		}

		// Only restock shelves and regenerate list if all items collected
		if (allItemsCollected) {
			// Regenerate grocery items and shopping list
			generateGroceryItems();
			generateShoppingList();
		}
	}
}

////////////////////////// GENERATE GROCERY ITEMS //////////////////////////

function generateGroceryItems() {
	currentHeldItems = [];
	itemCount = groceryItems.items.length;

	// Clear items from shelves
	for (let i = 0; i < groceryItems.shelfIndices.length; ++i) {
		let j = groceryItems.shelfIndices[i];
		$("#shelf-" + j.toString()).empty();
	}

	// Loop through list of items
	for (let i = 0; i < itemCount; ++i) {
		// Randomly select shelf to place item on
		let j = getRandomNumber(0, groceryItems.shelfIndices.length);
		let shelfIndex = groceryItems.shelfIndices[j];
		let shelf = $("#shelf-" + shelfIndex.toString());

		while (shelf.html() != "") {
			j = getRandomNumber(0, groceryItems.shelfIndices.length);
			shelfIndex = groceryItems.shelfIndices[j];
			shelf = $("#shelf-" + shelfIndex.toString());
		}

		// Add item to randomly selected shelf
		let itemHTML =
			"<img id='item-" +
			i.toString() +
			"' class='item " +
			groceryItems.items[i].name +
			"' src='" +
			groceryItems.items[i].src +
			"'/>";

		shelf.html(itemHTML);
	}
}

function generateShoppingList() {
	let list = $("#shopping-list");
	let itemIndices = [];

	list.empty();

	// Loop through spots on shopping list
	for (let i = 0; i < shoppingListLength; ++i) {
		// Randomly select item from groceryItems.items list
		let j = getRandomNumber(0, groceryItems.items.length);
		let name = groceryItems.items[j].name;
		let src = groceryItems.items[j].src;

		if (i != 0) {
			// Avoid repetition of items
			while (itemIndices.includes(src)) {
				j = getRandomNumber(0, groceryItems.items.length);
				name = groceryItems.items[j].name;
				src = groceryItems.items[j].src;
			}
		}

		itemIndices[i] = src;

		// Add selected item to shopping list
		let itemHTML =
			"<img class='list_item " +
			name +
			"' id='list_item-" +
			i.toString() +
			"' src='" +
			src +
			"'/>";

		list.append(itemHTML);
	}
}

let currentHeldItems = [];

////////////////////////// ADDING ITEMS //////////////////////////

// This function is called when an item is selected using spacebar.
// It is called within the keyRouter function.
function addItemToShoppingCart(item_id) {
	currentHeldItems.push(item_id);
	let pickedItem = $("#item-" + item_id.toString());
	let src = pickedItem.attr("src");
	let shoppingListItem;
	let itemInShoppingList = false;

	// Check if item is in shopping list
	for (let i = 0; i < shoppingListLength; ++i) {
		shoppingListItem = $("#list_item-" + i.toString());

		if (shoppingListItem.attr("src") === src) {
			itemInShoppingList = true;
			break;
		}
	}

	if (itemInShoppingList) {
		// If item in shopping list, mark as collected and increment potential score
		setPotentialScore(pointsPerItem);
		shoppingListItem.addClass("collected");
	} else {
		// If item not in shopping list, decrement potential score
		setPotentialScore(-pointsPerItem);
	}

	// Remove item from game window
	setInterval(() => {
		graduallyFadeAndRemoveElement(pickedItem);
	}, 500);
	pickedItem.css("border", "3px solid transparent");
	nearItem = null;
	nearItemExists = false;
}

////////////////////////// ITEM COLLISIONS //////////////////////////

function closeBy(item) {
	let toMiddleX = false;
	let toBottom = false;
	let toTop = false;

	let toLeft = false;
	let toRight = false;
	let toMiddleY = false;

	let middleXCheck = Math.abs(
		item.offset().left +
			item.width() / 2 -
			(player.offset().left + player.width() / 2)
	);
	//console.log("Middle X Check: " + middleXCheck);
	if (middleXCheck <= 20 && middleXCheck >= 0) {
		//console.log("Middle X Item Check Hit");
		toMiddleX = true;
	}

	let topCheck = item.offset().top - (player.offset().top + player.height());
	//console.log("Top Check: " + topCheck);
	if (topCheck <= 20 && topCheck >= -5) {
		//console.log("Top Item Check Hit");
		toTop = true;
	}

	let belowCheck = player.offset().top - (item.offset().top + item.height());
	//console.log("Below Check: " + belowCheck);
	if (belowCheck <= 20 && belowCheck >= -5) {
		//console.log("Below Item Check Hit");
		toBottom = true;
	}

	let middleYCheck = Math.abs(
		item.offset().top +
			item.height() / 2 -
			(player.offset().top + player.height() / 2)
	);
	//console.log("Middle Y Check: " + middleYCheck);
	if (middleYCheck <= 20 && middleYCheck >= 0) {
		//console.log("Middle Y Item Check Hit");
		toMiddleY = true;
	}

	let leftCheck =
		item.offset().left - (player.offset().left + player.width());
	//console.log("Left Check: " + leftCheck);
	if (leftCheck <= 20 && leftCheck >= -5) {
		//console.log("Left Item Check Hit")
		toLeft = true;
	}

	let rightCheck = player.offset().left - (item.offset().left + item.width());
	//console.log("Right Check: " + rightCheck);
	if (rightCheck <= 20 && rightCheck >= -5) {
		//console.log("Right Item Check Hit")
		toRight = true;
	}

	if ((toLeft || toRight) && toMiddleY) {
		return true;
	} else if ((toBottom || toTop) && toMiddleX) {
		return true;
	} else {
		return false;
	}
}

function checkForNearItems() {
	for (let i = 0; i < itemCount; i++) {
		//console.log(i);
		let item = $("#item-" + i);
		if (item.length && closeBy(item)) {
			if (nearItemExists == true) {
				// Removing past nearItem
				pastNearItem = $("#item-" + nearItem);
				pastNearItem.css("border", "3px solid transparent");
			}

			// console.log("New Nearby Item Detected");
			nearItemExists = true;
			nearItem = i;
			item.css("border", "3px solid #FFFFFF");

			return;
		}
	}

	// Nothing is Near, Making sure past item has no item
	if (nearItemExists) {
		nearItemExists = false;
		pastNearItem = $("#item-" + nearItem);
		pastNearItem.css("border", "3px solid transparent");
		nearItem = null;
	}
}

////////////////////////// OBSTACLE COLLISIONS //////////////////////////

function checkForObstacleCollision() {
	for (let i = 0; i < germIndex; i++) {
		let germ = $("#g-" + i);
		if (germ.length > 0) {
			// Checking if it exists
			if (isColliding(player, germ) && !haveImmunity) {
				setHealth(-10);
			}
		}
	}

	for (let i = 0; i < sickPersonIndex; i++) {
		let sickPerson = $("#s-" + i);
		if (sickPerson.length > 0) {
			// Checking if it exists
			if (isColliding(player, sickPerson) && !haveImmunity) {
				setHealth(-20);
			}
		}
	}

	let medicine = $("#m-" + powerupIndex);
	if (medicine.length > 0) {
		// Checking if it exists
		if (powerupIndex % 5 === 0) {
			if (isColliding(player, medicine)) {
				haveImmunity = true;
				setHealth(100);
				$("#health-status").css("background", "magenta");
				setTimeout(function () {
					haveImmunity = false;
					$("#health-status").css("background", "var(--green3)");
				}, 10000);
			}
		} else {
			if (isColliding(player, medicine)) {
				setHealth(25);
			}
		}
	}
}

////////////////////////// GERM & SICK PEOPLE //////////////////////////

// create obstacle divs
function createGermDivString(germIndex) {
	return "<div id='g-" + germIndex + "' class='germ'></div>";
}

function createSickPersonString(sickPersonIndex) {
	return "<div id='s-" + sickPersonIndex + "' class='sickPerson'></div>";
}

// Get random number between min (inclusive) and max (exclusive) integer
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function createGermItem() {
	var germItemStr;
	var startingPosition = $("#player").css("left");

	germItemStr = createGermDivString(germIndex, "-germ");
	gwhGame.append(germItemStr);
	var curItem = $("#g-" + germIndex + ".germ");
	curItem.css("position", "absolute");
	curItem.css("left", getRandomNumber(10, 600));
	curItem.css("right", getRandomNumber(10, 600));
	curItem.css("top", getRandomNumber(0, 514));
	curItem.css("height", "40px");
	curItem.css("width", "46px");
	let colliding = false;
	let checkoutColliding = false;
	for (let i = 0; i < SHELF_COUNT; ++i) {
		let shelf = $("#shelf-" + i);
		let checkout = $("#checkout-0");
		if (isColliding(shelf, curItem)) {
			colliding = true;
		}
		if (isColliding(checkout, curItem)) {
			checkoutColliding = true;
		}
	}

	if (!colliding && !checkoutColliding) {
		curItem.append("<img src='img/germ.png' height='40px' width='46px'/>"); // src: https://www.pinterest.com/pin/155514993371543990/
		if (!mute && !soundEffectMusic) {
			$("#germ").get(0).play();
		}
		++germIndex;
	}

	setInterval(() => {
		graduallyFadeAndRemoveElement(curItem);
	}, 7500);
}

function createSickPerson() {
	//console.log(sickPersonIndex);
	var sickPersonStr;
	var startingPosition = $("#player").css("left");

	sickPersonStr = createSickPersonString(sickPersonIndex, "-sickPerson");
	//console.log(sickPersonStr);
	gwhGame.append(sickPersonStr);
	var curItem = $("#s-" + sickPersonIndex + ".sickPerson");
	curItem.css("position", "absolute");
	curItem.css("left", getRandomNumber(10, 600));
	curItem.css("right", getRandomNumber(10, 600));
	curItem.css("top", getRandomNumber(0, 500));
	curItem.css("height", "40px");
	curItem.css("width", "46px");

	let colliding = false;
	let checkoutColliding = false;
	for (let i = 0; i < SHELF_COUNT; ++i) {
		let shelf = $("#shelf-" + i);
		let checkout = $("#checkout-0");
		if (isColliding(shelf, curItem)) {
			colliding = true;
		}
		if (isColliding(checkout, curItem)) {
			checkoutColliding = true;
		}
	}

	if (!colliding && !checkoutColliding) {
		curItem.append(
			"<img src='img/sickPerson.png' height='50px' width='40px'/>" // src: http://clipart-library.com/sick-cliparts.html
		);
		if (!mute && !soundEffectMusic) {
			$("#cough").get(0).play();
		}
		++sickPersonIndex;
	}
	// top horizontal motion
	if (
		parseInt(curItem.css("top")) < 262 &&
		parseInt(curItem.css("top")) > 220
	) {
		if (
			parseInt(curItem.css("left")) < 680 &&
			parseInt(curItem.css("left")) > 55
		) {
			console.log("top horizontal motion");
			var finalPositionX = 610;
			var finalPositionY = 225;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}
	// bottom horizontal motion
	if (
		parseInt(curItem.css("left")) < 560 &&
		parseInt(curItem.css("left")) > 130
	) {
		if (
			parseInt(curItem.css("top")) < 475 &&
			parseInt(curItem.css("top")) > 400
		) {
			//console.log("bottom horizontal motion");
			var finalPositionX = 550;
			var finalPositionY = 450;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}
	// left most vertical
	if (
		parseInt(curItem.css("left")) < 75 &&
		parseInt(curItem.css("left")) > 25
	) {
		if (
			parseInt(curItem.css("top")) < 500 &&
			parseInt(curItem.css("top")) > 10
		) {
			//console.log("left most vertical motion");
			var finalPositionX = 75;
			var finalPositionY = 460;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}

	// top horizontal motion
	if (
		parseInt(curItem.css("top")) < 262 &&
		parseInt(curItem.css("top")) > 220
	) {
		if (
			parseInt(curItem.css("left")) < 680 &&
			parseInt(curItem.css("left")) > 55
		) {
			console.log("top horizontal motion");
			var finalPositionX = 610;
			var finalPositionY = 225;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}
	// bottom horizontal motion
	if (
		parseInt(curItem.css("left")) < 560 &&
		parseInt(curItem.css("left")) > 130
	) {
		if (
			parseInt(curItem.css("top")) < 475 &&
			parseInt(curItem.css("top")) > 400
		) {
			//console.log("bottom horizontal motion");
			var finalPositionX = 550;
			var finalPositionY = 450;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}
	// left most vertical
	if (
		parseInt(curItem.css("left")) < 75 &&
		parseInt(curItem.css("left")) > 25
	) {
		if (
			parseInt(curItem.css("top")) < 500 &&
			parseInt(curItem.css("top")) > 10
		) {
			//console.log("left most vertical motion");
			var finalPositionX = 75;
			var finalPositionY = 460;
			let itLeft = 100;

			let xChangeCalc =
				(finalPositionX - parseInt(curItem.css("left"))) / itLeft;
			let yChangeCalc =
				(finalPositionY - parseInt(curItem.css("top"))) / itLeft;

			let timesRun = 0;
			let itemTimer = setInterval(function () {
				timesRun += 1;
				updateThrownItemPosition(
					curItem,
					xChangeCalc,
					yChangeCalc,
					itLeft
				);

				if (timesRun === itLeft) {
					clearInterval(itemTimer);
					setInterval(() => {
						graduallyFadeAndRemoveElement(curItem);
					}, 5000);
				}
			}, OBJECT_REFRESH_RATE);
		}
	}

	setInterval(() => {
		graduallyFadeAndRemoveElement(curItem);
	}, 7500);
}

function updateThrownItemPosition(
	elementObj,
	xChange,
	yChange,
	iterationsLeft
) {
	let colliding = false;
	for (let i = 0; i < SHELF_COUNT; ++i) {
		let shelf = $("#shelf-" + i);
		if (isColliding(shelf, elementObj)) {
			colliding = true;
		}
	}

	let checkout = $("#checkout-0");
	if (isColliding(checkout, elementObj)) {
		colliding = true;
	}

	if (!colliding) {
		elementObj.css("left", parseInt(elementObj.css("left")) + xChange);

		elementObj.css("top", parseInt(elementObj.css("top")) + yChange);
	}
}

function graduallyFadeAndRemoveElement(elementObj) {
	// Fade to 0 opacity over 2 seconds
	elementObj.fadeTo(2000, 0, function () {
		$(this).remove();
	});
}

////////////////////////// FAUCI AND POWER UPS //////////////////////////
function createFauci(fauciIndex) {
	return "<div id='f-" + fauciIndex + "' class='fauci'></div>";
}

function createMedicine(powerupIndex) {
	return "<div id='m-" + powerupIndex + "' class='medicine'></div>";
}

function createFauciFact(factIndex) {
	return "<div id='fact-" + factIndex + "' class='fact'></div>";
}

function fauciAppears() {
	let fauciStr;
	fauciStr = createFauci(fauciIndex);
	gwhGame.append(fauciStr);
	var curItem = $("#f-" + fauciIndex + ".fauci");
	curItem.css("position", "relative");
	curItem.css("left", "620px");
	//curItem.css("right", getRandomNumber(10, 600));
	curItem.css("top", "-110px");
	curItem.css("height", "100");
	curItem.css("width", "100");
	curItem.append(
		"<img src='img/fauci.png' height='100px' width='100px'/>" // src: https://images.app.goo.gl/PMFfNi43aJxkNv5Q8
	);

	++fauciIndex;
	setInterval(() => {
		graduallyFadeAndRemoveElement(curItem);
	}, 5000);
}

function factAppears() {
	let factStr;
	factStr = createFauciFact(factIndex);
	gwhGame.append(factStr);
	var curItem = $("#fact-" + factIndex + ".fact");
	curItem.css("position", "relative");
	curItem.css("left", "525px");
	curItem.css("top", "-230px");
	curItem.css("height", "100px");
	curItem.css("width", "100px");
	//curItem.css("backgroundColor", "white");
	if (powerupIndex % 5 === 0) {
		curItem.append(
			"<p> LOOK! A Vaccine - temporary immunity acquired! </p>"
		);
	} else {
		curItem.append("<p> Don't forget to wear a mask! </p>");
	}

	setInterval(() => {
		graduallyFadeAndRemoveElement(curItem);
	}, 5000);
}

function updateThrownMedicinePosition(
	elementObj,
	xChange,
	yChange,
	iterationsLeft
) {
	elementObj.css("left", parseInt(elementObj.css("left")) + xChange);

	elementObj.css("top", parseInt(elementObj.css("top")) + yChange);
}

function medicineAppears() {
	let medicineStr;
	medicineStr = createMedicine(powerupIndex);
	gwhGame.append(medicineStr);
	var curItem = $("#m-" + powerupIndex + ".medicine");
	curItem.css("position", "absolute");
	curItem.css("left", "590px");
	curItem.css("top", "610px");

	if (powerupIndex % 5 === 0) {
		curItem.append(
			"<img class='medicineImage' src='img/vaccine.svg' height='50px' width='50px'/>" // src: https://publicdomainvectors.org/en/free-clipart/Syringe-icon-vector/3733.html
		);
	} else {
		curItem.append(
			"<img class='medicineImage' src='img/medicine.png' height='50px' width='50px'/>" // src: https://images.app.goo.gl/rvKtQKVYAmYqEmbp8
		);
	}

	let finalPositionX;
	let finalPositionY;

	let shelfColliding = true;
	let checkoutColliding = true;
	let attempt = 0;

	while (shelfColliding || checkoutColliding) {
		shelfColliding = false;
		checkoutColliding = false;

		//console.log("Attempt " + attempt);

		finalPositionX = getRandomNumber(0, 550);
		finalPositionY = getRandomNumber(50, 550);

		curItem.css("left", finalPositionX);
		curItem.css("top", finalPositionY);

		for (let i = 0; i < SHELF_COUNT; ++i) {
			let shelf = $("#shelf-" + i);
			if (isColliding(shelf, curItem)) {
				shelfColliding = true;
			}
		}

		let checkout = $("#checkout-0");
		if (isColliding(checkout, curItem)) {
			checkoutColliding = true;
		}

		attempt++;
	}

	//console.log(finalPositionX, finalPositionY);

	//finalPositionX *= -1;

	curItem.css("left", "590px");
	curItem.css("top", "610px");

	if (!mute && !soundEffectMusic) {
		$("#medicine").get(0).play();
	}

	let itLeft = 25;
	let xChangeCalc = ((590 - finalPositionX) / itLeft) * -1;
	let yChangeCalc = ((610 - finalPositionY) / itLeft) * -1;
	let timesRun = 0;
	let itemTimer = setInterval(function () {
		timesRun += 1;
		updateThrownMedicinePosition(curItem, xChangeCalc, yChangeCalc, itLeft);

		if (timesRun === itLeft) {
			clearInterval(itemTimer);
			setTimeout(() => {
				graduallyFadeAndRemoveElement(curItem);
				powerupIndex++;
			}, 5000);
		}
	}, OBJECT_REFRESH_RATE);
}

////////////////////////// MOVING PLAYER //////////////////////////

function collidingWithShelf() {
	for (let i = 0; i < SHELF_COUNT; i++) {
		let shelf = $("#shelf-" + i);
		if (isColliding(player, shelf)) {
			return true;
		}
	}
	let checkout = $("#checkout-0");
	if (isColliding(player, checkout)) {
		return true;
	}
	return false;
}

////////////////////////// MOVING PLAYER //////////////////////////

function collidingWithShelf() {
	for (let i = 0; i < SHELF_COUNT; i++) {
		let shelf = $("#shelf-" + i);
		if (isColliding(player, shelf)) {
			return true;
		}
	}
	let checkout = $("#checkout-0");
	if (isColliding(player, checkout)) {
		return true;
	}
	return false;
}

// Handle player movement events
function movePerson(arrow) {
	switch (arrow) {
		case KEYS.left: {
			// left arrow
			let currentPos = parseInt(player.css("left"));
			let newPos = parseInt(player.css("left")) - person_speed;
			if (newPos < 0) {
				newPos = 0;
			}
			player.css("left", newPos);
			if (collidingWithShelf()) {
				player.css("left", currentPos);
			}
			break;
		}

		case KEYS.right: {
			// right arrow
			let currentPos = parseInt(player.css("left"));
			let newPos = parseInt(player.css("left")) + person_speed;
			if (newPos > maxPersonPosX) {
				newPos = maxPersonPosX;
			}
			player.css("left", newPos);
			if (collidingWithShelf()) {
				player.css("left", currentPos);
			}
			break;
		}
		case KEYS.up: {
			// up arrow
			let currentPos = parseInt(player.css("top"));
			let newPos = parseInt(player.css("top")) - person_speed;
			if (newPos < 0) {
				newPos = 0;
			}
			player.css("top", newPos);
			if (collidingWithShelf()) {
				player.css("top", currentPos);
			}
			break;
		}
		case KEYS.down: {
			// down arrow
			let currentPos = parseInt(player.css("top"));
			let newPos = parseInt(player.css("top")) + person_speed;
			if (newPos > maxPersonPosY) {
				newPos = maxPersonPosY;
			}
			player.css("top", newPos);
			if (collidingWithShelf()) {
				player.css("top", currentPos);
			}
			break;
		}
	}
}

function keydownRouter(e) {
	switch (e.which) {
		case KEYS.shift:
			break;
		case KEYS.spacebar:
			if (nearItemExists && !currentHeldItems.includes(nearItem)) {
				addItemToShoppingCart(nearItem);
			}
			break;
		case KEYS.left:
		case KEYS.right:
		case KEYS.up:
		case KEYS.down:
			e.preventDefault();
			if (!paused) {
				movePerson(e.which);
			}
			break;
		default:
			console.log("Invalid input!");
	}
}

// Check if two objects are colliding
function isColliding(o1, o2) {
	const o1D = {
		left: o1.offset().left,
		right: o1.offset().left + o1.width(),
		top: o1.offset().top,
		bottom: o1.offset().top + o1.height(),
	};
	const o2D = {
		left: o2.offset().left,
		right: o2.offset().left + o2.width(),
		top: o2.offset().top,
		bottom: o2.offset().top + o2.height(),
	};
	// Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	if (
		o1D.left < o2D.right &&
		o1D.right > o2D.left &&
		o1D.top < o2D.bottom &&
		o1D.bottom > o2D.top
	) {
		// collision detected!
		return true;
	}
	return false;
}

////////////////////////// SPLASH SCREEN //////////////////////////

function next1() {
	$("#gameBackground").hide();
	$("#gameControls").show();
	$("#background").get(0).play();
}

function next2() {
	$("#gameControls").hide();
	$("#earningPoints").show();
}

function next3() {
	$("#earningPoints").hide();
	$("#powerUps").show();
}

function next4() {
	$("#powerUps").hide();
	$("#gamePandemicGuidelines").show();
}

function startGame() {
	$("#splash-screen").hide();
	$("#pause-screen").hide();
	$("#game-screen").show();
	$("#side-panel").show();
	$("#hud-panel").show();
	$("#background").get(0).play();

	console.log("Ready!");

	generateShelves();
	generateGroceryItems();
	generateShoppingList();

	player = $("#player"); // set the global player handle

	// Set global positions
	maxPersonPosX = $("#game-window").width() - player.width();
	maxPersonPosY = $("#game-window").height() - player.height();

	gwhGame = $("#game-window");

	$(window).keydown(keydownRouter);

	createGermItemIntervalHandle = setInterval(
		createGermItem,
		currGermFrequency
	);
	createSickPersonIntervalHandle = setInterval(
		createSickPerson,
		currSickPersonFrequency
	);

	// interval for Dr. Fauci and medicine popping up
	createFauciIntervalHandle = setInterval(function () {
		fauciAppears();
		factAppears();
		medicineAppears();
	}, fauciFrequency);

	setInterval(function () {
		checkForNearItems();
	}, 100);

	createObstacleCollisionHandle = setInterval(function () {
		checkForObstacleCollision();
	}, 750);

	setInterval(function () {
		checkForCheckingOut();
	}, 750);
}

function back1() {
	$("#gameBackground").show();
	$("#gameControls").hide();
}

function back2() {
	$("#gameControls").show();
	$("#earningPoints").hide();
}

function back3() {
	$("#earningPoints").show();
	$("#powerUps").hide();
}
function back4() {
	$("#powerUps").show();
	$("#gamePandemicGuidelines").hide();
}

////////////////////////// PAUSED GAME //////////////////////////

function settingsMenu() {
	console.log("Game Paused");
	paused = true;
	$("#pause-screen").show();

	clearInterval(createObstacleCollisionHandle);
	// TODO: Keep the germs/sick people from disappearing???
}

function continueGame() {
	$("#pause-screen").hide();
	paused = false;
	var allAudio = document.getElementById("allAudio");
	var bkgm = document.getElementById("bkgMusic");
	var soundfx = document.getElementById("soundEffects");
	mute = allAudio.checked == true ? true : false;
	backgroundMusic = bkgm.checked == true ? true : false;
	soundEffectMusic = soundfx.checked == true ? true : false;
	if (!mute && !backgroundMusic) {
		$("#background").volume = 0.1;
		$("#background").get(0).play();
	} else {
		$("#background").get(0).pause();
	}

	var easy = document.getElementById("easy");
	var medium = document.getElementById("medium");
	var hard = document.getElementById("hard");

	if (easy.checked) {
		if (currentDifficulty != "easy") {
			changedDifficulty = true;
			// Change Timeouts
			currGermFrequency = 1000;
			currSickPersonFrequency = 2000;
			fauciFrequency = 10000;

			currentDifficulty = "easy";
		}
	} else if (medium.checked) {
		if (currentDifficulty != "medium") {
			changedDifficulty = true;
			// Change Timeouts
			currGermFrequency = 750;
			currSickPersonFrequency = 1500;
			fauciFrequency = 10000;

			currentDifficulty = "medium";
		}
	} else if (hard.checked) {
		if (currentDifficulty != "hard") {
			changedDifficulty = true;
			// Change Timeouts
			currGermFrequency = 500;
			currSickPersonFrequency = 1000;
			fauciFrequency = 10000;

			currentDifficulty = "hard";
		}
	}

	if (changedDifficulty) {
		// Clear Current Intervals
		clearInterval(createGermItemIntervalHandle);
		clearInterval(createSickPersonIntervalHandle);

		// Restart the intervals
		createGermItemIntervalHandle = setInterval(
			createGermItem,
			currGermFrequency
		);

		createSickPersonIntervalHandle = setInterval(
			createSickPerson,
			currSickPersonFrequency
		);

		changedDifficulty = false;
	}

	createObstacleCollisionHandle = setInterval(function () {
		checkForObstacleCollision();
	}, 750);
}

////////////////////////// END OF GAME //////////////////////////

function setHealth(diff) {
	health += diff;
	$("#health-status").css("width", health + "%");
	if (health > 100) {
		health = 100;
		person_speed = 10;
	} else if (health <= 0) {
		health = 0;
		endGame();
	} else if (health < 25) {
		person_speed = 5;
	} else {
		person_speed = 10;
	}
}

function setScore(diff) {
	score += diff;
	scoreDisplayUpdate();
}

function setPotentialScore(diff) {
	potentialScore += diff;
	scoreDisplayUpdate();
}

function scoreDisplayUpdate() {
	let scoreString = "Score: " + score.toString() + " (";

	if (potentialScore > 0) {
		scoreString += "+";
	}

	scoreString += potentialScore.toString() + ")";

	$("#score").html(scoreString);
}

function displayScore() {
	endDiv = $("#end-game");

	timeOut = 1000;
	setTimeout(function () {
		// if the player died
		if (health <= 0) {
			endDiv.append('<h1 id="game-over-text">Game Over</p>');
		}
	}, timeOut);
	timeOut += 1000;

	setTimeout(function () {
		endDiv.append(
			'<p id="score-info">Potential Points Lost: ' +
				potentialScore +
				"</p>"
		);
	}, timeOut);
	timeOut += 1000;

	finalScore = score + health * 5;
	setTimeout(function () {
		endDiv.append('<h1 id="final-score">Final Score: ' + score + "</p>");
	}, timeOut);

	setTimeout(function () {
		endDiv.append(
			'<button class="replayButton" onclick="restartGame()">Replay Game</button>'
		);
	}, timeOut);
}

function endGame() {
	if (!gameOver) {
		gameOver = true;
		console.log("end game");
		endDiv = $("#end-game");
		endDiv.show();
		clearInterval(createGermItemIntervalHandle);
		clearInterval(createSickPersonIntervalHandle);
		clearInterval(createFauciIntervalHandle);
		displayScore();
	}
}

function restartGame() {
	gameOver = false;
	score = 0;
	potentialScore = 0;
	scoreDisplayUpdate();
	generateGroceryItems();
	generateShoppingList();
	player.css("left", "450px");
	player.css("top", "50px");
	setHealth(100);

	endDiv = $("#end-game");
	endDiv.empty();
	endDiv.hide();

	setTimeout(function () {
		createGermItemIntervalHandle = setInterval(
			createGermItem,
			currGermFrequency
		);

		createSickPersonIntervalHandle = setInterval(
			createSickPerson,
			currSickPersonFrequency
		);

		createFauciIntervalHandle = setInterval(function () {
			fauciAppears();
			factAppears();
			medicineAppears();
		}, fauciFrequency);
	}, 1000);
}

////////////////////////// GENERATING SHELVES //////////////////////////

function createShelfDivString(shelfIndex) {
	return "<div class='shelf' id='shelf-" + shelfIndex.toString() + "'></div>";
}

function generateShelves() {
	for (let i = 0; i < SHELF_COUNT; ++i) {
		$("#game-screen").append(createShelfDivString(i));
	}

	shelfPlacement();
}

function shelfPlacement() {
	let topBorder = 10;
	let leftBorder = 10;
	let y = 10;
	let x = 10;
	let shelfWidth = 42;
	let shelfHeight = 42;

	// top row
	for (let i = 0; i < 9; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);

		x += shelfWidth;
	}

	// left column
	x = leftBorder;
	y = topBorder + shelfWidth;
	for (let i = 9; i < 20; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	// bottom row
	for (let i = 20; i < 37; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		x += shelfWidth;
	}

	// right column
	x -= shelfWidth;
	y -= shelfHeight;
	for (let i = 37; i < 45; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y -= shelfHeight;
	}

	// top border of alcove
	y += shelfHeight;
	x -= shelfWidth;
	for (let i = 45; i < 49; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		x -= shelfWidth;
	}

	// center of alcove
	x += shelfWidth;
	y += 3 * shelfHeight;
	alcoveTop = y;
	alcoveLeft = x;
	for (let i = 49; i < 52; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	y = alcoveTop;
	x = alcoveLeft + shelfWidth;
	for (let i = 52; i < 55; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	// left fork
	x = leftBorder + 3 * shelfWidth;
	y = topBorder + shelfHeight;
	for (let i = 55; i < 59; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	x = leftBorder + 4 * shelfWidth;
	y = topBorder + shelfHeight;
	for (let i = 59; i < 63; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	// right fork
	x = leftBorder + 7 * shelfWidth;
	y = topBorder + shelfHeight;
	for (let i = 63; i < 67; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	x = leftBorder + 8 * shelfWidth;
	y = topBorder + shelfHeight;
	for (let i = 67; i < 71; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		y += shelfHeight;
	}

	// long stretch in center of store
	x = leftBorder + 3 * shelfWidth;
	y = topBorder + 8 * shelfHeight;
	for (let i = 71; i < 77; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		x += shelfWidth;
	}

	x = leftBorder + 3 * shelfWidth;
	y = topBorder + 9 * shelfHeight;
	for (let i = 77; i < 83; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		x += shelfWidth;
	}

	x = leftBorder + 3 * shelfWidth;
	y = topBorder + 7 * shelfHeight;
	for (let i = 83; i < 89; ++i) {
		let shelf = $("#shelf-" + i.toString());
		shelf.css("top", y);
		shelf.css("left", x);
		x += shelfWidth;
	}
}
