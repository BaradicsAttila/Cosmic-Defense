import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

export let wave: number = 0;
let enemys: Enemy[] = [];
let towers: Tower[] = [];
let coins: number = 1000;
let spawnInterval: number;
let health: number = 3;
let buildmode: boolean = false;
let upgrademode: boolean = false;
let destroymode: boolean = false;

const startBTN: HTMLDivElement = document.querySelector(
	".startBTN",
) as HTMLDivElement;
const coinSpan: HTMLSpanElement = document.querySelector(
	".coinSpan",
) as HTMLSpanElement;
coinSpan.innerHTML = coins.toString();
const portalLeft = window.getComputedStyle(
	document.querySelector(".endportal") as HTMLDivElement,
).left;
const buildmodediv: HTMLDivElement = document.querySelector(
	".buildmodediv",
) as HTMLDivElement;
const constructiondiv: HTMLDivElement = document.querySelector(
	".constructionsdiv",
) as HTMLDivElement;
const upgradediv: HTMLDivElement = document.querySelector(
	".upgradediv",
) as HTMLDivElement;
const destroydiv: HTMLDivElement = document.querySelector(
	".destroydiv",
) as HTMLDivElement;
const towrselecterdiv: HTMLDivElement = document.querySelector(
	".towerSeletor",
) as HTMLDivElement;
const cells = document.querySelectorAll(
	"td",
) as NodeListOf<HTMLTableCellElement>;
const selectableTowers = document.querySelectorAll(
	".towerselectdiv",
) as NodeListOf<HTMLTableCellElement>;

startBTN.addEventListener("click", () => {
	WaveStarted();
	(document.querySelector(".startportal") as HTMLDivElement).style.opacity =
		"1";
	(document.querySelector(".endportal") as HTMLDivElement).style.opacity = "1";
	startBTN.style.display = "none";
});

cells.forEach((c) => {
	c.addEventListener("click", () => {
		if (buildmode && !c.classList.contains("occupied")) {
			c.classList.add("occupied");
			let type: string = (
				document.querySelector(".selelectedturet p") as HTMLDivElement
			).innerHTML;
			let newtower: Tower = new Tower(type, (t: Tower) => LevelUp(t), c);
			coins -= newtower.Cost;
			alert(coins);
			coinSpan.innerHTML = coins.toString();
			towers.push(newtower);
		}
	});
});

function LevelUp(t: Tower): void {
	if (upgrademode && t.Upgradecost <= coins) {
		t.Level++;
		coins -= t.Upgradecost;
		coinSpan.innerHTML = coins.toString();
	}
}

function WaveStarted(): void {
	wave++;
	EnemySpawner();
	spawnInterval = setInterval(() => {
		enemys.forEach((e) => {
			e.Move();
			console.log("asdsad");
			if (
				Number(e.EnemyDiv.style.left.replace("px", "")) >=
				Number(portalLeft.replace("px", ""))
			) {
				let index: number = enemys.indexOf(e);
				enemys.splice(index, 1);

				e.Destroy();
				RemoveHart();
			}
		});
	}, 16);
}

function Killed(e: Enemy): void {
	let index: number = enemys.indexOf(e);
	enemys.splice(index, 1);
	e.Destroy();
	coins += Math.floor(e.Reward);
	coinSpan.innerHTML = coins.toString();
}

function EnemySpawner(): void {
	let amountToSpawn: number = Math.floor(23 * 1.2 ** (wave - 1));
	for (let i = 0; i < amountToSpawn; i++) {
		setTimeout(
			() => {
				enemys.push(new Enemy((e: Enemy) => Killed(e)));
			},
			i * (800 / 1.2 ** (wave - 1)),
		);
	}
}

function RemoveHart(): void {
	health--;
	(document.querySelector(".hartsdiv") as HTMLDivElement).style.width =
		(60 * health).toString() + "px";
	if (health <= 0) {
		GameOver();
	}
}

function GameOver(): void {
	clearInterval(spawnInterval);
}

buildmodediv.addEventListener("click", () => {
	upgrademode = false;
	upgradediv.style.backgroundColor = "transparent";
	destroymode = false;
	destroydiv.style.backgroundColor = "transparent";
	if (buildmode) {
		buildmode = false;
		towrselecterdiv.style.display = "none";
		constructiondiv.style.opacity = "0";
		cells.forEach((c) => {
			c.style.border = "2px transparent solid";
		});
	} else {
		buildmode = true;
		towrselecterdiv.style.display = "flex";
		constructiondiv.style.opacity = "1";
		cells.forEach((c) => {
			c.style.border = "2px orange solid";
		});
	}
});

upgradediv.addEventListener("click", () => {
	buildmode = false;
	towrselecterdiv.style.display = "none";
	constructiondiv.style.opacity = "0";
	destroymode = false;
	destroydiv.style.backgroundColor = "transparent";
	cells.forEach((c) => {
		c.style.border = "2px transparent solid";
	});

	if (upgrademode) {
		upgrademode = false;
		upgradediv.style.backgroundColor = "transparent";
	} else {
		upgrademode = true;
		upgradediv.style.backgroundColor = "green";
	}
});

destroydiv.addEventListener("click", () => {
	buildmode = false;
	towrselecterdiv.style.display = "none";
	constructiondiv.style.opacity = "0";
	upgrademode = false;
	upgradediv.style.backgroundColor = "transparent";
	cells.forEach((c) => {
		c.style.border = "2px transparent solid";
	});

	if (destroymode) {
		destroymode = false;
		destroydiv.style.backgroundColor = "transparent";
	} else {
		destroymode = true;
		destroydiv.style.backgroundColor = "orange";
	}
});

selectableTowers.forEach((s) => {
	s.addEventListener("click", () => {
		selectableTowers.forEach((t) => {
			t.classList.remove("selelectedturet");
		});
		s.classList.add("selelectedturet");
	});
});
